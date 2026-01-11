// Main generation pipeline - orchestrates research, content generation, and page creation
import { v4 as uuidv4 } from 'uuid';
import { generatePageContent } from './anthropic';
import { createPage, updatePage, getSettings } from '@/lib/db';
import { uploadFile, readTextFile } from '@/lib/storage';
import type { GeneratedPage, PageGenerationInput, BusinessType, BusinessResearch } from '@/types';

/**
 * Generate a URL-safe slug from company name
 */
function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Load RAG context from uploaded documents
 */
async function loadRagContext(settings: Awaited<ReturnType<typeof getSettings>>): Promise<string> {
  const parts: string[] = [];

  if (settings.ragDocuments?.salesKnowledgeBase) {
    const content = await readTextFile(settings.ragDocuments.salesKnowledgeBase);
    if (content) parts.push(`## Sales Knowledge Base\n${content}`);
  }

  if (settings.ragDocuments?.businessIntelDossier) {
    const content = await readTextFile(settings.ragDocuments.businessIntelDossier);
    if (content) parts.push(`## Business Intelligence\n${content}`);
  }

  if (settings.ragDocuments?.salesTranscripts) {
    const content = await readTextFile(settings.ragDocuments.salesTranscripts);
    if (content) parts.push(`## Sales Transcripts\n${content}`);
  }

  return parts.join('\n\n');
}

/**
 * Parse the uploaded business research MD file into structured data
 */
function parseBusinessResearch(content: string, companyName: string): BusinessResearch {
  // Extract business type from content (look for keywords)
  const businessTypeKeywords: Record<BusinessType, string[]> = {
    'ecommerce': ['ecommerce', 'e-commerce', 'online store', 'shopify', 'woocommerce', 'dropshipping'],
    'info-product': ['course', 'info product', 'digital product', 'ebook', 'training', 'coaching program'],
    'saas': ['saas', 'software', 'platform', 'subscription', 'app'],
    'agency': ['agency', 'marketing agency', 'ad agency', 'digital agency', 'creative agency'],
    'coaching': ['coach', 'coaching', 'mentor', 'consulting', 'consultant'],
    'local-business': ['local', 'brick and mortar', 'restaurant', 'gym', 'clinic', 'dental', 'medical'],
  };

  let detectedType: BusinessType = 'ecommerce'; // default
  const lowerContent = content.toLowerCase();

  for (const [type, keywords] of Object.entries(businessTypeKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      detectedType = type as BusinessType;
      break;
    }
  }

  // Try to extract industry from common patterns
  const industryPatterns = [
    /industry:\s*(.+)/i,
    /sector:\s*(.+)/i,
    /niche:\s*(.+)/i,
    /market:\s*(.+)/i,
  ];

  let industry = 'General';
  for (const pattern of industryPatterns) {
    const match = content.match(pattern);
    if (match) {
      industry = match[1].trim().split('\n')[0].trim();
      break;
    }
  }

  // Extract products/services
  const productsPatterns = [
    /products?:\s*(.+)/i,
    /services?:\s*(.+)/i,
    /offerings?:\s*(.+)/i,
  ];

  let products: string[] = [];
  for (const pattern of productsPatterns) {
    const match = content.match(pattern);
    if (match) {
      products = match[1].split(',').map(p => p.trim()).filter(p => p.length > 0);
      break;
    }
  }

  // Extract target market
  const targetPatterns = [
    /target\s*(?:market|audience|customer)s?:\s*(.+)/i,
    /ideal\s*(?:customer|client)s?:\s*(.+)/i,
  ];

  let targetMarket = 'Business owners and entrepreneurs';
  for (const pattern of targetPatterns) {
    const match = content.match(pattern);
    if (match) {
      targetMarket = match[1].trim().split('\n')[0].trim();
      break;
    }
  }

  // Extract brand positioning
  const positioningPatterns = [
    /positioning:\s*(.+)/i,
    /value\s*proposition:\s*(.+)/i,
    /brand:\s*(.+)/i,
  ];

  let brandPositioning = `${companyName} provides premium solutions for their target market`;
  for (const pattern of positioningPatterns) {
    const match = content.match(pattern);
    if (match) {
      brandPositioning = match[1].trim().split('\n')[0].trim();
      break;
    }
  }

  return {
    businessModel: detectedType,
    industry,
    products,
    targetMarket,
    brandPositioning,
    rawResearch: content,
  };
}

/**
 * Main generation function
 */
export async function generatePages(input: PageGenerationInput): Promise<GeneratedPage> {
  const pageId = uuidv4();
  const slug = generateSlug(input.companyName);
  const settings = await getSettings();

  // Create initial page record with "generating" status
  const initialPage: GeneratedPage = {
    id: pageId,
    slug,
    referenceName: input.referenceName,
    businessUrl: input.businessUrl,
    companyName: input.companyName,
    loomVideoUrl: input.loomVideoUrl,
    companyLogoUrl: null,
    hyrosLogoUrl: settings.hyrosLogoUrl,
    adSpend: input.adSpend,
    adRevenue: input.adRevenue,
    primaryProductLink: input.primaryProductLink,
    primaryProductPrice: input.primaryProductPrice,
    downsellProductLink: input.downsellProductLink,
    downsellProductPrice: input.downsellProductPrice,
    content: {
      headline: '',
      subheadline: '',
      benefits: [],
      roiCopy: '',
      whatYouGetIntro: '',
    },
    researchData: null,
    createdAt: new Date().toISOString(),
    status: 'generating',
  };

  await createPage(initialPage);

  try {
    // Step 1: Upload company logo
    const logoResult = await uploadFile(
      input.companyLogo,
      `${slug}-logo.png`,
      'logos'
    );
    const companyLogoUrl = logoResult.url;

    // Step 2: Read and parse business research from uploaded MD file
    const researchContent = await input.businessResearch.text();
    const research = parseBusinessResearch(researchContent, input.companyName);

    // Step 3: Load RAG context
    const ragContext = await loadRagContext(settings);

    // Step 4: Generate content using Claude (testimonials are now embedded in benefits)
    const content = await generatePageContent(
      research,
      ragContext,
      settings.generationSystemPrompt
    );

    // Step 5: Update page with generated content
    const completedPage: Partial<GeneratedPage> = {
      companyLogoUrl,
      content,
      researchData: research,
      status: 'ready',
    };

    await updatePage(pageId, completedPage);

    return {
      ...initialPage,
      ...completedPage,
    } as GeneratedPage;
  } catch (error) {
    // Update page with error status
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await updatePage(pageId, {
      status: 'error',
      errorMessage,
    });

    throw error;
  }
}
