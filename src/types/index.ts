// Core data types for HYROS Sales Page Generator

export interface GeneratedPage {
  id: string;
  slug: string;
  referenceName: string;
  businessUrl?: string; // Optional - for reference only
  companyName: string;
  loomVideoUrl: string;
  companyLogoUrl: string | null;
  hyrosLogoUrl: string;
  adSpend: number;
  adRevenue: number;
  primaryProductLink: string;
  primaryProductPrice: number;
  downsellProductLink: string;
  downsellProductPrice: number;
  content: GeneratedContent;
  researchData: BusinessResearch | null;
  createdAt: string;
  status: 'generating' | 'ready' | 'error';
  errorMessage?: string;
}

export interface GeneratedContent {
  headline: string;
  subheadline: string;
  benefits: Benefit[];
  roiCopy: string;
  whatYouGetIntro: string;
}

export interface BenefitTestimonial {
  quote: string;
  name: string;
  company: string;
  stat: string;
  statLabel: string;
  logoUrl?: string;  // Clearbit logo URL
}

export interface Benefit {
  title: string;
  description: string;
  testimonial: BenefitTestimonial;
}

export interface BusinessResearch {
  businessModel: BusinessType;
  industry: string;
  products: string[];
  targetMarket: string;
  brandPositioning: string;
  rawResearch: string;
}

export type BusinessType =
  | 'ecommerce'
  | 'info-product'
  | 'saas'
  | 'agency'
  | 'coaching'
  | 'local-business';

export interface Testimonial {
  id: string;
  imageUrl: string;
  businessName: string;
  businessType: BusinessType;
  industry: string;
  adSpendRange: AdSpendRange;
  tags: string[];
  createdAt: string;
}

export type AdSpendRange =
  | '<$10k'
  | '$10k-50k'
  | '$50k-100k'
  | '$100k-250k'
  | '$250k+';

export type BenefitFocus = 'scaling' | 'cost-saving' | 'ai-targeting';

// Rich testimonial entry for the testimonial bank
export interface TestimonialEntry {
  id: string;
  companyName: string;
  companyDescription: string;
  businessModel: string;
  industry: string;
  logoUrl: string | null;
  quote: string;
  stat: string;
  statLabel: string;
  personName?: string;
  benefitFocus: BenefitFocus;
  tags: string[];
  domain?: string;  // For Clearbit lookup
  createdAt: string;
}

export interface Settings {
  hyrosLogoUrl: string;
  generationSystemPrompt: string;
  ragDocuments: {
    salesKnowledgeBase: string | null;
    businessIntelDossier: string | null;
    salesTranscripts: string | null;
  };
  testimonialBankRaw: string | null;  // Raw MD file content
  updatedAt: string;
}

// Form input types
export interface PageGenerationInput {
  referenceName: string;
  companyName: string;
  businessUrl?: string; // Optional - for reference only
  companyLogo: File; // Required - manual upload
  businessResearch: File; // Required - MD file with business research
  loomVideoUrl: string;
  adSpend: number;
  adRevenue: number;
  primaryProductLink: string;
  primaryProductPrice: number;
  downsellProductLink: string;
  downsellProductPrice: number;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerateResponse {
  pageId: string;
  slug: string;
}

// ROI calculation types
export interface ROICalculation {
  currentAdSpend: number;
  projectedAdSpend: number;
  currentRevenue: number;
  projectedRevenue: number;
  currentROI: number;
  projectedROI: number;
  improvementPercent: number;
}
