// Parser for extracting structured testimonials from markdown file
import type { TestimonialEntry, BenefitFocus } from '@/types';

interface ParsedTestimonial {
  companyName: string;
  companyDescription: string;
  businessModel: string;
  quote: string;
  stat: string;
  statLabel: string;
  personName?: string;
  domain?: string;
  brandAssetUrl?: string;
}

// Known company domains for reliable logo fetching
const KNOWN_DOMAINS: Record<string, string> = {
  'tony robbins': 'tonyrobbins.com',
  'alex hormozi': 'acquisition.com',
  'acquisition.com': 'acquisition.com',
  'frank kern': 'frankkern.com',
  'grant cardone': 'grantcardone.com',
  'jay shetty': 'jayshetty.me',
  'dean graziosi': 'deangraziosi.com',
  'impact theory': 'impacttheory.com',
  'tom bilyeu': 'impacttheory.com',
  'sam ovens': 'skool.com',
  'skool': 'skool.com',
  'dan henry': 'danhenry.com',
  'traffic and funnels': 'trafficandfunnels.com',
  'kinobody': 'kinobody.com',
  'legion athletics': 'legionathletics.com',
  'tan books': 'tanbooks.com',
  'ladyboss': 'ladyboss.com',
  'beautiful earth': 'beautifulearthboutique.com',
  'sultan of style': 'sultanofstyle.com',
  'regenalight': 'regenalight.com',
  'milky mama': 'milky-mama.com',
  'clickfunnels': 'clickfunnels.com',
  'russell brunson': 'clickfunnels.com',
  'whop': 'whop.com',
  'iclosed': 'iclosed.io',
  'daptatech': 'dapta.ai',
  'playboy': 'playboy.com',
  'runpod': 'runpod.io',
  'matt schmitt': 'smartercontact.com',
  'smarter contact': 'smartercontact.com',
  'stockton': 'bettervideoad.com',
  'douglas james': 'thedouglasjames.com',
  'simpler trading': 'simplertrading.com',
  'eight sleep': 'eightsleep.com',
  'eightsleep': 'eightsleep.com',
};

/**
 * Parse the testimonials markdown file into structured data
 */
export function parseTestimonialsMarkdown(markdown: string): TestimonialEntry[] {
  const testimonials: TestimonialEntry[] = [];

  // Find all numbered testimonial headers (### **1. Company Name** or ### **1\. Company Name**)
  // Using a loose pattern that matches the header regardless of backslash escaping
  const headerPattern = /### \*\*(\d+)[^*]+\*\*/g;
  const headers: { index: number; number: string; fullMatch: string }[] = [];

  let match;
  while ((match = headerPattern.exec(markdown)) !== null) {
    headers.push({
      index: match.index,
      number: match[1] || String(headers.length + 1),
      fullMatch: match[0],
    });
  }

  // Extract content between headers
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const startIdx = header.index + header.fullMatch.length;
    const endIdx = i < headers.length - 1 ? headers[i + 1].index : markdown.length;
    const sectionContent = markdown.substring(startIdx, endIdx);

    if (!sectionContent?.trim()) continue;

    try {
      // Extract company name from header (e.g., "### **1\. Tony Robbins Ad Team**" -> "Tony Robbins Ad Team")
      // Remove the header prefix and trailing **, then clean up backslash-dot pattern
      let companyNameFromHeader = header.fullMatch
        .replace(/^### \*\*\d+/, '')  // Remove ### **NUMBER
        .replace(/\*\*$/, '')          // Remove trailing **
        .replace(/^\\\.?\s*/, '')      // Remove leading backslash-dot and space
        .replace(/^\.\s*/, '')         // Remove leading dot and space (if no backslash)
        .trim();

      const parsed = parseTestimonialSection(sectionContent, companyNameFromHeader);
      if (parsed && parsed.quote && parsed.companyName) {
        const entry: TestimonialEntry = {
          id: generateId(parsed.companyName),
          companyName: parsed.companyName,
          companyDescription: parsed.companyDescription || '',
          businessModel: parsed.businessModel || '',
          industry: inferIndustry(parsed.businessModel, parsed.companyDescription, parsed.companyName),
          logoUrl: parsed.brandAssetUrl || null, // Use Brand Asset URL from MD file
          quote: parsed.quote,
          stat: parsed.stat || '',
          statLabel: parsed.statLabel || '',
          personName: parsed.personName,
          benefitFocus: classifyBenefitFocus(parsed.quote, parsed.companyDescription),
          tags: generateTags(parsed.businessModel, parsed.companyDescription, parsed.companyName),
          domain: parsed.domain,
          createdAt: new Date().toISOString(),
        };
        testimonials.push(entry);
      }
    } catch (err) {
      console.warn(`Failed to parse testimonial section ${header.number}:`, err);
    }
  }

  return testimonials;
}

function parseTestimonialSection(section: string, companyNameFromHeader?: string): ParsedTestimonial | null {
  // Use company name from header if provided, otherwise try to extract from section
  let companyName = '';

  if (companyNameFromHeader) {
    companyName = companyNameFromHeader
      .replace(/\s+Ad\s+Team$/i, '')
      .replace(/\s*\([^)]+\)\s*$/i, '')
      .trim();
  } else {
    const lines = section.split('\n');
    const firstLine = lines[0]?.trim();
    if (!firstLine) return null;

    companyName = firstLine
      .replace(/\*+\s*$/, '')
      .replace(/^\*+/, '')
      .replace(/\s+Ad\s+Team$/i, '')
      .replace(/\s*\([^)]+\)\s*$/i, '')
      .trim();
  }

  if (!companyName) return null;

  // Extract fields using bullet point patterns
  const companyDescription = extractBulletField(section, 'Company Description');
  const businessModel = extractBulletField(section, 'Business Model');

  // Extract testimonial quote - look for quoted text after "Testimonial" header
  let quote = '';
  const testimonialMatch = section.match(/\*\s*\*\*Testimonial[^*]*\*\*[:\s]*[""]([^""]+)[""]/i);
  if (testimonialMatch) {
    quote = testimonialMatch[1].trim();
  } else {
    // Try alternate pattern
    const altMatch = section.match(/Testimonial[^"]*[""]([^""]+)[""]/i);
    if (altMatch) {
      quote = altMatch[1].trim();
    }
  }

  // Extract stat from quote
  const { stat, statLabel } = extractStatFromQuote(quote, section);

  // Extract person name
  const personName = extractPersonName(companyName, section);

  // Extract domain
  const domain = extractDomain(section, companyName);

  // Extract brand asset URL if present - prioritize direct image URLs
  const brandAssetUrl = extractBrandAssetUrl(section);

  return {
    companyName,
    companyDescription: companyDescription || '',
    businessModel: businessModel || '',
    quote,
    stat,
    statLabel,
    personName,
    domain,
    brandAssetUrl,
  };
}

function extractBulletField(text: string, fieldName: string): string {
  // Match: * **Field Name:** Content OR * **Field Name & Something:** Content
  const pattern = new RegExp(
    `\\*\\s*\\*\\*${fieldName}[^*]*\\*\\*[:\\s]*([^*]+?)(?=\\n\\s*\\*\\s*\\*\\*|$)`,
    'is'
  );
  const match = text.match(pattern);
  if (match) {
    // Clean up the extracted content
    return match[1]
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500); // Limit length
  }
  return '';
}

function extractStatFromQuote(quote: string, section: string): { stat: string; statLabel: string } {
  // Common stat patterns
  const patterns = [
    // Percentages with context
    { regex: /(\d+(?:\.\d+)?%)\s*(?:more\s+)?(profitable|growth|increase|ROAS|ROI)/i, labelIndex: 2 },
    { regex: /scale[d]?\s*(?:by\s+)?(\d+(?:\.\d+)?%)/i, label: 'growth' },
    { regex: /(\d+(?:\.\d+)?%)\s*(?:ad\s+)?spend/i, label: 'ad spend growth' },
    { regex: /save[d]?\s*(\d+(?:\.\d+)?%)/i, label: 'savings' },
    { regex: /(\d+(?:\.\d+)?%)\s*YOY/i, label: 'YoY growth' },
    // Dollar amounts
    { regex: /\$(\d+(?:,\d+)*k?)\s*(?:to|→)\s*\$(\d+(?:,\d+)*k?)/i, label: 'revenue growth', useSecond: true, prefix: '$' },
    { regex: /saving[s]?\s*\$(\d+(?:,\d+)*k?)/i, label: 'monthly savings', prefix: '$' },
    { regex: /\$(\d+(?:,\d+)*)\s*million/i, label: 'tracked revenue', prefix: '$', suffix: 'M' },
    // Multipliers
    { regex: /(\d+(?:\.\d+)?x)\s*(more|growth|ROAS)?/i, labelIndex: 2 },
    { regex: /(\d+)\s*star/i, label: 'rating' },
    // Large numbers
    { regex: /(\d+k\+?)\s*(active|businesses|users)?/i, labelIndex: 2 },
    { regex: /(\d+)\s*hours?/i, label: 'hours', suffix: 'h' },
    // ROAS specific
    { regex: /(\d+(?:\.\d+)?)\s*ROAS/i, label: 'ROAS', suffix: 'x' },
    // Generic percentages
    { regex: /(\d+(?:\.\d+)?%)/i, label: 'improvement' },
  ];

  const combinedText = quote + ' ' + section;

  for (const pattern of patterns) {
    const match = combinedText.match(pattern.regex);
    if (match) {
      let stat = pattern.useSecond ? match[2] : match[1];
      if (pattern.prefix) stat = pattern.prefix + stat;
      if (pattern.suffix) stat = stat + pattern.suffix;
      const label = pattern.label || (pattern.labelIndex && match[pattern.labelIndex]) || 'improvement';
      return { stat, statLabel: String(label).toLowerCase() };
    }
  }

  return { stat: '', statLabel: '' };
}

function extractPersonName(companyName: string, section: string): string | undefined {
  // Known persons mapping
  const knownPersons: Record<string, string> = {
    'tony robbins': 'Tony Robbins',
    'alex hormozi': 'Alex Hormozi',
    'frank kern': 'Frank Kern',
    'grant cardone': 'Grant Cardone',
    'jay shetty': 'Jay Shetty',
    'dean graziosi': 'Dean Graziosi',
    'tom bilyeu': 'Tom Bilyeu',
    'sam ovens': 'Sam Ovens',
    'dan henry': 'Dan Henry',
    'russell brunson': 'Russell Brunson',
    'taylor welch': 'Taylor Welch',
    'chris evans': 'Chris Evans',
    'greg o\'gallagher': 'Greg O\'Gallagher',
    'kaelin tuell': 'Kaelin Poulin',
    'matt schmitt': 'Matt Schmitt',
    'douglas james': 'Douglas James',
    'cody huelster': 'Cody Huelster',
  };

  const combinedText = (companyName + ' ' + section).toLowerCase();

  for (const [key, value] of Object.entries(knownPersons)) {
    if (combinedText.includes(key)) {
      return value;
    }
  }

  // Try to extract from parentheses
  const parenMatch = section.match(/\(([A-Z][a-z]+\s+[A-Z][a-z]+)\)/);
  if (parenMatch) {
    return parenMatch[1];
  }

  return undefined;
}

function extractDomain(section: string, companyName: string): string | undefined {
  // First check known domains
  const companyLower = companyName.toLowerCase();
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
    if (companyLower.includes(key)) {
      return domain;
    }
  }

  // Look for Clearbit URLs in Brand Asset
  const clearbitMatch = section.match(/logo\.clearbit\.com\/([a-z0-9.-]+\.[a-z]+)/i);
  if (clearbitMatch) {
    return clearbitMatch[1].toLowerCase();
  }

  // Look for explicit domain patterns
  const domainPatterns = [
    /([a-z0-9-]+\.(com|io|co|me|org|net))/gi,
  ];

  for (const pattern of domainPatterns) {
    const matches = section.match(pattern);
    if (matches) {
      for (const match of matches) {
        const domain = match.toLowerCase();
        // Skip common non-company domains
        if (!domain.includes('framer') &&
            !domain.includes('wikipedia') &&
            !domain.includes('clearbit') &&
            !domain.includes('youtube') &&
            !domain.includes('scribd')) {
          return domain;
        }
      }
    }
  }

  // Infer from company name as last resort
  const cleanName = companyName.toLowerCase()
    .replace(/\s+(ad\s+)?team$/i, '')
    .replace(/[^a-z0-9]/g, '');

  if (cleanName && cleanName.length > 2) {
    return `${cleanName}.com`;
  }

  return undefined;
}

function extractBrandAssetUrl(section: string): string | undefined {
  // Look for Brand Asset line
  const brandAssetMatch = section.match(/\*\s*\*\*Brand Asset:\*\*\s*(.+)/i);
  if (!brandAssetMatch) return undefined;

  const brandAssetLine = brandAssetMatch[1].trim();

  // Skip non-image entries
  if (brandAssetLine.toLowerCase().includes('context from') ||
      brandAssetLine.toLowerCase().includes('image/context')) {
    return undefined;
  }

  // Extract the first URL from the line
  const urlMatch = brandAssetLine.match(/https?:\/\/[^\s\n\]]+/);
  if (!urlMatch) return undefined;

  let url = urlMatch[0].trim();

  // Clean up URL - remove trailing characters that aren't part of URL
  url = url.replace(/[)\]}>]+$/, '');

  // Check if it's a direct image URL (not just a domain homepage)
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
  const imageHostingDomains = [
    'framerusercontent.com',
    'images.seeklogo.com',
    'images.leadconnectorhq.com',
    'upload.wikimedia.org',
    'assets.cdn.filesafe.space',
    'cdn.filesafe.space',
  ];

  const isDirectImage = imageExtensions.some(ext => url.toLowerCase().includes(ext));
  const isImageHosting = imageHostingDomains.some(domain => url.includes(domain));

  // If it's a direct image URL or from an image hosting domain, use it
  if (isDirectImage || isImageHosting) {
    return url;
  }

  // If it says "Logo available at", skip it (just a domain, not an image)
  if (brandAssetLine.toLowerCase().includes('logo available at')) {
    return undefined;
  }

  // If URL path contains image-like segments, use it
  if (url.includes('/images/') || url.includes('/logo') || url.includes('/media/') || url.includes('/assets/')) {
    return url;
  }

  return undefined;
}

function classifyBenefitFocus(quote: string, description: string): BenefitFocus {
  const text = (quote + ' ' + description).toLowerCase();

  // Scaling keywords
  const scalingKeywords = ['scale', 'growth', 'grow', 'revenue', 'sales', 'double', 'triple', 'increase revenue', 'million', '100%', 'profit', 'yoy', 'year over year'];
  const scalingScore = scalingKeywords.filter(k => text.includes(k)).length;

  // Cost-saving keywords
  const costKeywords = ['save', 'saving', 'cost', 'waste', 'cut', 'reduce', 'burning', 'bleed', 'stop', 'efficient', 'over reporting', 'over-reporting'];
  const costScore = costKeywords.filter(k => text.includes(k)).length;

  // AI/targeting keywords
  const aiKeywords = ['ai', 'algorithm', 'target', 'targeting', 'optimize', 'optimization', 'platform', 'facebook', 'google', 'meta', 'train', 'pixel', 'attribution', 'tracking', 'transparency'];
  const aiScore = aiKeywords.filter(k => text.includes(k)).length;

  // Return the highest scoring focus
  if (costScore > scalingScore && costScore >= aiScore) return 'cost-saving';
  if (aiScore > scalingScore && aiScore > costScore) return 'ai-targeting';
  return 'scaling'; // Default to scaling
}

function inferIndustry(businessModel: string, description: string, companyName: string): string {
  const text = (businessModel + ' ' + description + ' ' + companyName).toLowerCase();

  if (text.includes('supplement') || text.includes('fitness') || text.includes('health') || text.includes('workout') || text.includes('protein')) return 'Health & Fitness';
  if (text.includes('e-commerce') || text.includes('ecommerce') || text.includes('dtc') || text.includes('direct-to-consumer') || text.includes('shopify') || text.includes('jewelry') || text.includes('fragrance')) return 'E-Commerce';
  if (text.includes('saas') || text.includes('software') || text.includes('platform') || text.includes('subscription') || text.includes('cloud')) return 'SaaS & Technology';
  if (text.includes('coach') || text.includes('consulting') || text.includes('training') || text.includes('seminar') || text.includes('personal development')) return 'Coaching & Consulting';
  if (text.includes('course') || text.includes('education') || text.includes('mastery') || text.includes('certification') || text.includes('book')) return 'Education & Info Products';
  if (text.includes('agency') || text.includes('marketing') || text.includes('media buyer')) return 'Agency & Marketing';
  if (text.includes('finance') || text.includes('trading') || text.includes('invest') || text.includes('stock') || text.includes('options')) return 'Finance & Trading';
  if (text.includes('real estate')) return 'Real Estate';

  return 'Business & Entrepreneurship';
}

function generateTags(businessModel: string, description: string, companyName: string): string[] {
  const text = (businessModel + ' ' + description + ' ' + companyName).toLowerCase();
  const tags: string[] = [];

  if (text.includes('high-ticket') || text.includes('premium') || text.includes('$2,000') || text.includes('$10,000') || text.includes('thousands of dollars')) {
    tags.push('high-ticket');
  }
  if (text.includes('subscription') || text.includes('recurring') || text.includes('monthly')) {
    tags.push('subscription');
  }
  if (text.includes('dtc') || text.includes('direct-to-consumer') || text.includes('ecommerce') || text.includes('e-commerce')) {
    tags.push('dtc');
  }
  if (text.includes('b2b') || text.includes('business to business') || text.includes('enterprise')) {
    tags.push('b2b');
  }
  if (text.includes('info') || text.includes('course') || text.includes('education') || text.includes('digital product')) {
    tags.push('info-product');
  }
  if (text.includes('coach') || text.includes('consulting') || text.includes('mastermind')) {
    tags.push('coaching');
  }
  if (text.includes('saas') || text.includes('software')) {
    tags.push('saas');
  }
  if (text.includes('agency') || text.includes('client')) {
    tags.push('agency');
  }

  return tags;
}

function generateId(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

export default parseTestimonialsMarkdown;
