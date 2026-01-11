// Anthropic Claude integration for content generation
import Anthropic from '@anthropic-ai/sdk';
import type { BusinessResearch, GeneratedContent, Benefit } from '@/types';
import {
  getTestimonialBankForPromptAsync,
  findBestTestimonialAsync,
  findBestTestimonial,
} from '@/lib/data/testimonials';
import { PAGE_CONTENT_TEMPLATE } from '@/lib/data/page-content-template';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generatePageContent(
  research: BusinessResearch,
  ragContext: string,
  systemPrompt: string
): Promise<GeneratedContent> {
  // Check if API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('Anthropic API key not configured, using mock content');
    return generateMockContent(research);
  }

  const userPrompt = await buildGenerationPrompt(research, ragContext);

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text content from response
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return validateContent(parsed, research);
  } catch (error) {
    console.error('Anthropic API error:', error);
    // Fall back to mock content if API fails
    return generateMockContent(research);
  }
}

async function buildGenerationPrompt(
  research: BusinessResearch,
  ragContext: string
): Promise<string> {
  const products = research.products?.join(', ') || 'their products';

  // Load testimonial bank (from database if available, otherwise defaults)
  const testimonialBankPrompt = await getTestimonialBankForPromptAsync();

  return `## CONTENT TEMPLATE GUIDE
${PAGE_CONTENT_TEMPLATE}

---

## Prospect Business Research
${JSON.stringify(research, null, 2)}

## HYROS Knowledge Base
${ragContext || 'No RAG context provided.'}

## TESTIMONIAL BANK
CRITICAL INSTRUCTIONS FOR TESTIMONIAL SELECTION:
1. Select a DIFFERENT testimonial for each of the 3 benefits - NEVER repeat the same testimonial
2. PRIORITIZE testimonials from the same industry as the prospect (e.g., if prospect is E-Commerce, select E-Commerce testimonials)
3. Each benefit has a specific section below - select from the appropriate section:
   - Benefit 1 (Scaling): Select from "SCALING TESTIMONIALS"
   - Benefit 2 (Cost-Saving): Select from "COST-SAVING TESTIMONIALS"
   - Benefit 3 (AI-Targeting): Select from "AI-TARGETING TESTIMONIALS"
4. If a testimonial has a Logo URL, ALWAYS include it in your response as "logoUrl"
5. Use testimonials with concrete stats/numbers when available

${testimonialBankPrompt}

## TASK: Generate Personalized Sales Page Content

Create compelling, personalized content for this prospect. We need 4 benefits with testimonials.

**CRITICAL TESTIMONIAL REQUIREMENTS:**
- Benefit 1: MUST use Tony Robbins testimonial (find "Tony Robbins" in the testimonial bank)
- Benefit 2: MUST use Alex Hormozi testimonial (find "Alex Hormozi" or "Hormozi" in the testimonial bank)
- Benefits 3 & 4: Select testimonials that match the prospect's business model (${research.businessModel}) and industry (${research.industry})

### BENEFIT 1: SCALING / MAKING MONEY
- **Focus**: How HYROS helps them scale ad spend and sell MORE of their specific products
- **Must reference**: Their actual products (${products})
- **Must explain**: How accurate attribution enables confident scaling decisions
- **Angle**: "You can finally double down on winners because you KNOW they're winners"
- **Testimonial**: MUST USE TONY ROBBINS testimonial from the bank

### BENEFIT 2: SAVING AD COSTS
- **Focus**: How HYROS reduces wasted ad spend
- **Must explain**: How bad platform data causes overspending on losing campaigns
- **Must include**: Specific cost-saving angle for their ${research.businessModel} business model
- **Angle**: "Stop bleeding money on campaigns that aren't actually converting"
- **Testimonial**: MUST USE ALEX HORMOZI testimonial from the bank

### BENEFIT 3: AI OPTIMIZATION / TARGETING
- **Focus**: How feeding accurate HYROS data back to Meta/Google/TikTok improves their ad targeting
- **Must explain**: How accurate conversion data trains the platform AI to find better buyers
- **Must include**: Platform-specific benefits relevant to their channels
- **Angle**: "The platforms will finally find more people like your REAL buyers, not tire-kickers"
- **Testimonial**: Select one that matches their ${research.businessModel} business model

### BENEFIT 4: PROVEN RESULTS IN THEIR INDUSTRY (appears after ROI calculator)
- **Focus**: Social proof specific to their business type
- **Must explain**: How businesses like theirs have succeeded with HYROS
- **Angle**: "Businesses just like yours are seeing real results"
- **Testimonial**: Select one that matches their ${research.businessModel} business model (different from Benefit 3)

## OUTPUT FORMAT

Return ONLY valid JSON in this exact format:
{
  "headline": "How HYROS Will Increase [Their Company]'s Ad ROI & Scale",
  "subheadline": "Personalized subheadline about their specific situation (max 120 chars)",
  "benefits": [
    {
      "title": "Scaling benefit title mentioning their products",
      "description": "2-3 sentences about how HYROS helps them scale and sell more of ${products}. Be specific to their ${research.businessModel} business model.",
      "testimonial": {
        "quote": "Full quote from TONY ROBBINS testimonial",
        "name": "Tony Robbins",
        "company": "Tony Robbins Companies",
        "stat": "stat from testimonial",
        "statLabel": "label from testimonial",
        "logoUrl": "logo URL from testimonial bank"
      }
    },
    {
      "title": "Cost-saving benefit title",
      "description": "2-3 sentences about how HYROS stops wasted ad spend in their ${research.industry} business.",
      "testimonial": {
        "quote": "Full quote from ALEX HORMOZI testimonial",
        "name": "Alex Hormozi",
        "company": "Acquisition.com",
        "stat": "stat from testimonial",
        "statLabel": "label from testimonial",
        "logoUrl": "logo URL from testimonial bank"
      }
    },
    {
      "title": "AI targeting benefit title",
      "description": "2-3 sentences about how feeding HYROS data to ad platforms improves their targeting.",
      "testimonial": {
        "quote": "Full quote from industry-matched testimonial",
        "name": "Person name",
        "company": "company.com",
        "stat": "stat from testimonial",
        "statLabel": "label from testimonial",
        "logoUrl": "logo URL from testimonial bank"
      }
    },
    {
      "title": "Industry-specific success title",
      "description": "2-3 sentences about proven results in their ${research.businessModel} business type.",
      "testimonial": {
        "quote": "Full quote from different industry-matched testimonial",
        "name": "Person name",
        "company": "company.com",
        "stat": "stat from testimonial",
        "statLabel": "label from testimonial",
        "logoUrl": "logo URL from testimonial bank"
      }
    }
  ],
  "roiCopy": "Custom ROI copy referencing their ${research.industry} industry and 15-30% improvement (never say 2-3x)",
  "whatYouGetIntro": "Intro text for What You Get section specific to their business"
}

IMPORTANT:
- Benefit 1 testimonial MUST be Tony Robbins
- Benefit 2 testimonial MUST be Alex Hormozi
- Benefits 3 & 4 testimonials should match their business model
- Reference their specific products by name where possible
- Use their business model context (${research.businessModel})
- Be specific, not generic. This page should feel custom-written for THEM.`;
}

function validateContent(
  parsed: Record<string, unknown>,
  research: BusinessResearch
): GeneratedContent {
  const defaultBenefits = getDefaultBenefits(research);

  return {
    headline: String(
      parsed.headline || `How HYROS Will Increase Your Ad ROI & Scale`
    ),
    subheadline: String(
      parsed.subheadline || 'See exactly which ads drive revenue'
    ),
    benefits: Array.isArray(parsed.benefits)
      ? parsed.benefits.slice(0, 4).map((b: Record<string, unknown>, i: number) => {
          const testimonial = b.testimonial as Record<string, unknown> | undefined;
          return {
            title: String(b.title || defaultBenefits[i]?.title || 'Track Every Sale'),
            description: String(
              b.description || defaultBenefits[i]?.description || 'Know precisely which ads drive results.'
            ),
            testimonial: {
              quote: String(
                testimonial?.quote || defaultBenefits[i]?.testimonial.quote || ''
              ),
              name: String(
                testimonial?.name || defaultBenefits[i]?.testimonial.name || ''
              ),
              company: String(
                testimonial?.company || defaultBenefits[i]?.testimonial.company || ''
              ),
              stat: String(
                testimonial?.stat || defaultBenefits[i]?.testimonial.stat || ''
              ),
              statLabel: String(
                testimonial?.statLabel || defaultBenefits[i]?.testimonial.statLabel || ''
              ),
              logoUrl: testimonial?.logoUrl
                ? String(testimonial.logoUrl)
                : defaultBenefits[i]?.testimonial.logoUrl,
            },
          };
        })
      : defaultBenefits,
    roiCopy: String(
      parsed.roiCopy || 'See your true ROI with accurate attribution'
    ),
    whatYouGetIntro: String(
      parsed.whatYouGetIntro || 'Everything you need to scale with confidence'
    ),
  };
}

function getDefaultBenefits(research: BusinessResearch): Benefit[] {
  const businessType = research.businessModel || 'ecommerce';
  const industry = research.industry || 'your industry';
  const adSpend = 100000; // Default for testimonial matching

  // Find matching testimonials (sync version for fallback)
  const aiTargetingTestimonial = findBestTestimonial(businessType, 'ai-targeting', adSpend);
  const industryTestimonial = findBestTestimonial(businessType, 'scaling', adSpend);

  return [
    {
      title: 'Scale Winners, Kill Losers Fast',
      description: `Know precisely which ads actually drive sales in your ${industry} business—even when customers browse on their phone and buy on desktop weeks later. Finally scale with confidence, not hope.`,
      testimonial: {
        quote: 'HYROS has completely transformed how we track and scale our advertising. The accuracy is unmatched.',
        name: 'Tony Robbins',
        company: 'Tony Robbins Companies',
        stat: '300%',
        statLabel: 'ROI increase',
        logoUrl: undefined,
      },
    },
    {
      title: 'Stop Bleeding Money on Bad Campaigns',
      description: `Your ${businessType === 'saas' ? 'Meta and Google campaigns are' : 'campaigns are'} optimizing for the wrong customers because platforms can't see 40% of your sales. Stop paying for campaigns that aren't converting.`,
      testimonial: {
        quote: 'Before HYROS, we were flying blind. Now we know exactly which campaigns drive real revenue.',
        name: 'Alex Hormozi',
        company: 'Acquisition.com',
        stat: '$100M+',
        statLabel: 'tracked revenue',
        logoUrl: undefined,
      },
    },
    {
      title: 'Train Ad Platforms to Find Real Buyers',
      description: `Feed HYROS data back to Meta and Google so their AI finds more people like your REAL buyers—not tire-kickers who never convert. Watch your ${industry} ad performance improve automatically.`,
      testimonial: aiTargetingTestimonial
        ? {
            quote: aiTargetingTestimonial.quote,
            name: aiTargetingTestimonial.name,
            company: aiTargetingTestimonial.company,
            stat: aiTargetingTestimonial.stat,
            statLabel: aiTargetingTestimonial.statLabel,
            logoUrl: aiTargetingTestimonial.logoUrl,
          }
        : {
            quote: 'The platform algorithms finally understand who our buyers are.',
            name: 'HYROS Customer',
            company: 'Business',
            stat: '40%',
            statLabel: 'better targeting',
          },
    },
    {
      title: `Proven Results for ${industry} Businesses`,
      description: `Businesses just like yours are seeing real results with HYROS. Join hundreds of ${businessType} companies who have transformed their ad tracking and scaled profitably.`,
      testimonial: industryTestimonial
        ? {
            quote: industryTestimonial.quote,
            name: industryTestimonial.name,
            company: industryTestimonial.company,
            stat: industryTestimonial.stat,
            statLabel: industryTestimonial.statLabel,
            logoUrl: industryTestimonial.logoUrl,
          }
        : {
            quote: 'HYROS gave us the clarity we needed to scale confidently.',
            name: 'HYROS Customer',
            company: 'Business',
            stat: '2x',
            statLabel: 'ad spend scaled',
          },
    },
  ];
}

function generateMockContent(research: BusinessResearch): GeneratedContent {
  const businessType = research.businessModel || 'ecommerce';
  const industry = research.industry || 'your industry';

  const headlines: Record<string, string> = {
    ecommerce: `How HYROS Will Increase Your E-Commerce Ad ROI & Scale`,
    saas: `How HYROS Will Increase Your SaaS Ad ROI & Scale`,
    'info-product': `How HYROS Will Increase Your Course Ad ROI & Scale`,
    coaching: `How HYROS Will Increase Your Coaching Ad ROI & Scale`,
    agency: `How HYROS Will Increase Your Agency's Ad ROI & Scale`,
    'local-business': `How HYROS Will Increase Your Local Business Ad ROI & Scale`,
  };

  return {
    headline: headlines[businessType] || headlines.ecommerce,
    subheadline: `This is a custom video on how HYROS will dramatically increase your ad ROI`,
    benefits: getDefaultBenefits(research),
    roiCopy: `Businesses in ${industry} see an average 15-30% improvement in ad ROI within 90 days of implementing HYROS tracking.`,
    whatYouGetIntro: `Everything you need to finally see the truth about your ${industry} ad performance and scale with confidence.`,
  };
}
