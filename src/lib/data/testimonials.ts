// Testimonial bank for AI selection
// Loads dynamically from database (uploaded via Settings), falls back to hardcoded defaults

import type { BusinessType, TestimonialEntry, BenefitFocus } from '@/types';
import { getTestimonialBank } from '@/lib/db';

export type AdSpendTier = 'small' | 'medium' | 'large';

// Legacy interface for backward compatibility with existing code
export interface LegacyTestimonialEntry {
  id: string;
  quote: string;
  name: string;
  company: string;
  stat: string;
  statLabel: string;
  logoUrl?: string;
  tags: {
    businessTypes: BusinessType[];
    benefitFocus: BenefitFocus;
    adSpendTier: AdSpendTier;
  };
}

// Default testimonials (used when no bank is uploaded)
const DEFAULT_TESTIMONIAL_BANK: LegacyTestimonialEntry[] = [
  // ============ SCALING TESTIMONIALS ============
  {
    id: 'tony-robbins-scaling',
    quote: "Hyros allowed us to scale our ad spend by 43% for business mastery and over 100% for unleash the power within.",
    name: "Tony Robbins",
    company: "tonyrobbins.com",
    stat: "43%",
    statLabel: "ad spend growth",
    tags: {
      businessTypes: ['coaching', 'info-product'],
      benefitFocus: 'scaling',
      adSpendTier: 'large',
    },
  },
  {
    id: 'whop-scaling',
    quote: "Hyros has had a massive impact when tracking and optimizing ads for peak revenue. Almost all businesses doing 7+ figures per month swear by Hyros.",
    name: "Whop",
    company: "whop.com",
    stat: "100k+",
    statLabel: "active businesses",
    tags: {
      businessTypes: ['ecommerce', 'saas', 'info-product'],
      benefitFocus: 'scaling',
      adSpendTier: 'large',
    },
  },
  {
    id: 'ecom-scaling-1',
    quote: "We went from $200k/mo to $1.2M/mo in ad spend because we finally knew which campaigns were actually profitable.",
    name: "Jordan Miller",
    company: "Premium DTC Brand",
    stat: "6x",
    statLabel: "ad spend scaled",
    tags: {
      businessTypes: ['ecommerce'],
      benefitFocus: 'scaling',
      adSpendTier: 'large',
    },
  },
  {
    id: 'saas-scaling-1',
    quote: "HYROS showed us our true LTV by channel. We doubled down on YouTube and scaled from $50k to $300k MRR.",
    name: "Mike Chen",
    company: "B2B SaaS",
    stat: "6x",
    statLabel: "MRR growth",
    tags: {
      businessTypes: ['saas'],
      benefitFocus: 'scaling',
      adSpendTier: 'medium',
    },
  },

  // ============ COST-SAVING TESTIMONIALS ============
  {
    id: 'cost-saving-1',
    quote: "We were wasting $40k/month on campaigns Facebook said were working. HYROS showed us the truth and we cut the dead weight.",
    name: "David Park",
    company: "Info Product Business",
    stat: "$40k",
    statLabel: "monthly savings",
    tags: {
      businessTypes: ['info-product', 'coaching'],
      benefitFocus: 'cost-saving',
      adSpendTier: 'medium',
    },
  },
  {
    id: 'cost-saving-2',
    quote: "HYROS revealed that 60% of our 'converting' traffic was actually coming from organic. We stopped paying for clicks we were getting free.",
    name: "Amanda Torres",
    company: "E-commerce Brand",
    stat: "60%",
    statLabel: "misattributed spend found",
    tags: {
      businessTypes: ['ecommerce'],
      benefitFocus: 'cost-saving',
      adSpendTier: 'medium',
    },
  },
  {
    id: 'cost-saving-3',
    quote: "We cut our CPA by 35% in 60 days just by killing the campaigns that weren't actually converting.",
    name: "James Wilson",
    company: "Coaching Business",
    stat: "35%",
    statLabel: "CPA reduction",
    tags: {
      businessTypes: ['coaching', 'info-product'],
      benefitFocus: 'cost-saving',
      adSpendTier: 'small',
    },
  },

  // ============ AI TARGETING TESTIMONIALS ============
  {
    id: 'hormozi-transparency',
    quote: "You have transparency in all ad tracking. The people that are attracted to HYROS are psychos about numbers / tracking growth like me.",
    name: "Alex Hormozi",
    company: "acquisition.com",
    stat: "Transparent",
    statLabel: "ad tracking",
    tags: {
      businessTypes: ['coaching', 'agency', 'info-product'],
      benefitFocus: 'ai-targeting',
      adSpendTier: 'large',
    },
  },
  {
    id: 'ai-targeting-1',
    quote: "Once we started feeding HYROS data back to Meta, our CPM dropped 22% because Facebook finally understood who our real buyers were.",
    name: "Rachel Green",
    company: "DTC Brand",
    stat: "22%",
    statLabel: "CPM reduction",
    tags: {
      businessTypes: ['ecommerce'],
      benefitFocus: 'ai-targeting',
      adSpendTier: 'medium',
    },
  },
  {
    id: 'ai-targeting-2',
    quote: "Google's algorithm was optimizing for tire-kickers. After HYROS integration, our lead quality improved 40% with the same spend.",
    name: "Tech Startup",
    company: "B2B SaaS",
    stat: "40%",
    statLabel: "lead quality improvement",
    tags: {
      businessTypes: ['saas', 'agency'],
      benefitFocus: 'ai-targeting',
      adSpendTier: 'medium',
    },
  },
  {
    id: 'ai-targeting-3',
    quote: "TikTok was sending us the wrong audience entirely. HYROS data fixed our pixel and conversions doubled in 3 weeks.",
    name: "Influencer Brand",
    company: "E-commerce",
    stat: "2x",
    statLabel: "conversions",
    tags: {
      businessTypes: ['ecommerce', 'info-product'],
      benefitFocus: 'ai-targeting',
      adSpendTier: 'small',
    },
  },
];

// Convert database TestimonialEntry to legacy format
function convertToLegacyFormat(entry: TestimonialEntry): LegacyTestimonialEntry {
  // Map industry to business types
  const businessTypeMap: Record<string, BusinessType[]> = {
    'Health & Fitness': ['ecommerce', 'coaching'],
    'Coaching & Consulting': ['coaching', 'info-product'],
    'Education & Info Products': ['info-product', 'coaching'],
    'E-Commerce': ['ecommerce'],
    'SaaS & Technology': ['saas'],
    'Agency & Marketing': ['agency'],
    'Finance & Trading': ['info-product', 'coaching'],
    'Real Estate': ['coaching', 'local-business'],
    'Business & Entrepreneurship': ['coaching', 'info-product', 'agency'],
  };

  const businessTypes = businessTypeMap[entry.industry] || ['ecommerce'];

  // Infer ad spend tier from tags or default to medium
  let adSpendTier: AdSpendTier = 'medium';
  if (entry.tags.includes('high-ticket')) {
    adSpendTier = 'large';
  } else if (entry.tags.includes('dtc') || entry.tags.includes('subscription')) {
    adSpendTier = 'medium';
  }

  return {
    id: entry.id,
    quote: entry.quote,
    name: entry.personName || entry.companyName,
    company: entry.domain || `${entry.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
    stat: entry.stat || '',
    statLabel: entry.statLabel || '',
    logoUrl: entry.logoUrl || undefined,
    tags: {
      businessTypes,
      benefitFocus: entry.benefitFocus,
      adSpendTier,
    },
  };
}

// Helper function to find best matching testimonial (async version)
export async function findBestTestimonialAsync(
  businessType: BusinessType,
  benefitFocus: BenefitFocus,
  adSpend: number
): Promise<LegacyTestimonialEntry | null> {
  // Try to load from database first
  let bank: LegacyTestimonialEntry[] = [];

  try {
    const dbBank = await getTestimonialBank();
    if (dbBank && dbBank.length > 0) {
      bank = dbBank.map(convertToLegacyFormat);
    }
  } catch (error) {
    console.warn('Failed to load testimonial bank from database:', error);
  }

  // Fall back to defaults if database is empty
  if (bank.length === 0) {
    bank = DEFAULT_TESTIMONIAL_BANK;
  }

  // Determine ad spend tier
  let adSpendTier: AdSpendTier;
  if (adSpend < 50000) {
    adSpendTier = 'small';
  } else if (adSpend < 250000) {
    adSpendTier = 'medium';
  } else {
    adSpendTier = 'large';
  }

  // Find exact matches first
  const exactMatches = bank.filter(
    (t) =>
      t.tags.businessTypes.includes(businessType) &&
      t.tags.benefitFocus === benefitFocus &&
      t.tags.adSpendTier === adSpendTier
  );

  if (exactMatches.length > 0) {
    return exactMatches[Math.floor(Math.random() * exactMatches.length)];
  }

  // Fall back to matching business type and benefit focus
  const partialMatches = bank.filter(
    (t) =>
      t.tags.businessTypes.includes(businessType) &&
      t.tags.benefitFocus === benefitFocus
  );

  if (partialMatches.length > 0) {
    return partialMatches[Math.floor(Math.random() * partialMatches.length)];
  }

  // Fall back to just benefit focus
  const benefitMatches = bank.filter(
    (t) => t.tags.benefitFocus === benefitFocus
  );

  if (benefitMatches.length > 0) {
    return benefitMatches[Math.floor(Math.random() * benefitMatches.length)];
  }

  return null;
}

// Synchronous version using defaults (for backward compatibility)
export function findBestTestimonial(
  businessType: BusinessType,
  benefitFocus: BenefitFocus,
  adSpend: number
): LegacyTestimonialEntry | null {
  const bank = DEFAULT_TESTIMONIAL_BANK;

  // Determine ad spend tier
  let adSpendTier: AdSpendTier;
  if (adSpend < 50000) {
    adSpendTier = 'small';
  } else if (adSpend < 250000) {
    adSpendTier = 'medium';
  } else {
    adSpendTier = 'large';
  }

  // Find exact matches first
  const exactMatches = bank.filter(
    (t) =>
      t.tags.businessTypes.includes(businessType) &&
      t.tags.benefitFocus === benefitFocus &&
      t.tags.adSpendTier === adSpendTier
  );

  if (exactMatches.length > 0) {
    return exactMatches[Math.floor(Math.random() * exactMatches.length)];
  }

  // Fall back to matching business type and benefit focus
  const partialMatches = bank.filter(
    (t) =>
      t.tags.businessTypes.includes(businessType) &&
      t.tags.benefitFocus === benefitFocus
  );

  if (partialMatches.length > 0) {
    return partialMatches[Math.floor(Math.random() * partialMatches.length)];
  }

  // Fall back to just benefit focus
  const benefitMatches = bank.filter(
    (t) => t.tags.benefitFocus === benefitFocus
  );

  if (benefitMatches.length > 0) {
    return benefitMatches[Math.floor(Math.random() * benefitMatches.length)];
  }

  return null;
}

// Export testimonial bank as string for AI prompt (async version)
export async function getTestimonialBankForPromptAsync(): Promise<string> {
  // Try to load from database first
  let bank: LegacyTestimonialEntry[] = [];
  let dbEntries: TestimonialEntry[] = [];

  try {
    dbEntries = await getTestimonialBank();
    if (dbEntries && dbEntries.length > 0) {
      bank = dbEntries.map(convertToLegacyFormat);
    }
  } catch (error) {
    console.warn('Failed to load testimonial bank from database:', error);
  }

  // Fall back to defaults if database is empty
  if (bank.length === 0) {
    return DEFAULT_TESTIMONIAL_BANK.map(
      (t) =>
        `[${t.id}] "${t.quote}" - ${t.name}, ${t.company} | Stat: ${t.stat} ${t.statLabel} | Tags: ${t.tags.businessTypes.join(', ')} | Focus: ${t.tags.benefitFocus} | Tier: ${t.tags.adSpendTier}`
    ).join('\n\n');
  }

  // Group testimonials by industry and benefit focus for easier AI selection
  const groupedOutput: string[] = [];

  // Group by benefit focus
  const scalingTestimonials = bank.filter(t => t.tags.benefitFocus === 'scaling');
  const costSavingTestimonials = bank.filter(t => t.tags.benefitFocus === 'cost-saving');
  const aiTargetingTestimonials = bank.filter(t => t.tags.benefitFocus === 'ai-targeting');

  if (scalingTestimonials.length > 0) {
    groupedOutput.push('=== SCALING TESTIMONIALS (for Benefit 1) ===');
    scalingTestimonials.forEach((t, i) => {
      const dbEntry = dbEntries.find(e => e.id === t.id);
      const industry = dbEntry?.industry || 'General';
      groupedOutput.push(
        `[${t.id}] Industry: ${industry} | "${t.quote}" - ${t.name}, ${t.company}${t.logoUrl ? ` | Logo: ${t.logoUrl}` : ''} | Stat: ${t.stat} ${t.statLabel}`
      );
    });
  }

  if (costSavingTestimonials.length > 0) {
    groupedOutput.push('\n=== COST-SAVING TESTIMONIALS (for Benefit 2) ===');
    costSavingTestimonials.forEach((t, i) => {
      const dbEntry = dbEntries.find(e => e.id === t.id);
      const industry = dbEntry?.industry || 'General';
      groupedOutput.push(
        `[${t.id}] Industry: ${industry} | "${t.quote}" - ${t.name}, ${t.company}${t.logoUrl ? ` | Logo: ${t.logoUrl}` : ''} | Stat: ${t.stat} ${t.statLabel}`
      );
    });
  }

  if (aiTargetingTestimonials.length > 0) {
    groupedOutput.push('\n=== AI-TARGETING TESTIMONIALS (for Benefit 3) ===');
    aiTargetingTestimonials.forEach((t, i) => {
      const dbEntry = dbEntries.find(e => e.id === t.id);
      const industry = dbEntry?.industry || 'General';
      groupedOutput.push(
        `[${t.id}] Industry: ${industry} | "${t.quote}" - ${t.name}, ${t.company}${t.logoUrl ? ` | Logo: ${t.logoUrl}` : ''} | Stat: ${t.stat} ${t.statLabel}`
      );
    });
  }

  return groupedOutput.join('\n');
}

// Synchronous version using defaults (for backward compatibility)
export function getTestimonialBankForPrompt(): string {
  return DEFAULT_TESTIMONIAL_BANK.map(
    (t) =>
      `[${t.id}] "${t.quote}" - ${t.name}, ${t.company} | Stat: ${t.stat} ${t.statLabel} | Tags: ${t.tags.businessTypes.join(', ')} | Focus: ${t.tags.benefitFocus} | Tier: ${t.tags.adSpendTier}`
  ).join('\n\n');
}

// Export the default bank for reference
export const TESTIMONIAL_BANK = DEFAULT_TESTIMONIAL_BANK;
