// Gemini API integration for business research
// Currently uses mock implementation - real Gemini integration TBD
import type { BusinessResearch, BusinessType } from '@/types';

export async function researchBusiness(url: string): Promise<BusinessResearch> {
  // Check if Gemini API key is configured
  if (!process.env.GEMINI_API_KEY) {
    console.log('Gemini API key not configured, using mock research');
    return generateMockResearch(url);
  }

  // TODO: Implement real Gemini API call when ready
  // For now, return mock research based on URL analysis
  return generateMockResearch(url);
}

function generateMockResearch(url: string): BusinessResearch {
  // Analyze URL to make educated guesses about business type
  const urlLower = url.toLowerCase();

  let businessModel: BusinessType = 'ecommerce';
  let industry = 'retail';
  let products: string[] = ['Products'];
  let targetMarket = 'Consumers';
  let brandPositioning = 'Quality products at competitive prices';

  // Simple heuristics based on URL patterns
  if (urlLower.includes('coach') || urlLower.includes('consulting') || urlLower.includes('mentor')) {
    businessModel = 'coaching';
    industry = 'professional development';
    products = ['Coaching programs', 'Mentorship', 'Consulting'];
    targetMarket = 'Professionals seeking growth';
    brandPositioning = 'Expert guidance for professional success';
  } else if (urlLower.includes('course') || urlLower.includes('learn') || urlLower.includes('academy')) {
    businessModel = 'info-product';
    industry = 'education';
    products = ['Online courses', 'Training programs', 'Digital products'];
    targetMarket = 'Learners and professionals';
    brandPositioning = 'Knowledge and skills for success';
  } else if (urlLower.includes('agency') || urlLower.includes('marketing') || urlLower.includes('digital')) {
    businessModel = 'agency';
    industry = 'marketing services';
    products = ['Marketing services', 'Advertising management', 'Brand strategy'];
    targetMarket = 'Businesses seeking growth';
    brandPositioning = 'Results-driven marketing solutions';
  } else if (urlLower.includes('saas') || urlLower.includes('software') || urlLower.includes('app') || urlLower.includes('.io')) {
    businessModel = 'saas';
    industry = 'software';
    products = ['Software platform', 'SaaS solution', 'Digital tools'];
    targetMarket = 'Businesses and professionals';
    brandPositioning = 'Powerful software for modern teams';
  } else if (urlLower.includes('shop') || urlLower.includes('store') || urlLower.includes('buy')) {
    businessModel = 'ecommerce';
    industry = 'retail';
    products = ['Physical products', 'Consumer goods'];
    targetMarket = 'Online shoppers';
    brandPositioning = 'Quality products delivered to your door';
  } else if (urlLower.includes('fitness') || urlLower.includes('gym') || urlLower.includes('health')) {
    businessModel = 'ecommerce';
    industry = 'fitness';
    products = ['Fitness products', 'Supplements', 'Equipment'];
    targetMarket = 'Health-conscious consumers';
    brandPositioning = 'Helping you achieve your fitness goals';
  } else if (urlLower.includes('beauty') || urlLower.includes('skincare') || urlLower.includes('cosmetic')) {
    businessModel = 'ecommerce';
    industry = 'beauty';
    products = ['Beauty products', 'Skincare', 'Cosmetics'];
    targetMarket = 'Beauty enthusiasts';
    brandPositioning = 'Premium beauty solutions';
  } else if (urlLower.includes('fashion') || urlLower.includes('clothing') || urlLower.includes('wear')) {
    businessModel = 'ecommerce';
    industry = 'fashion';
    products = ['Clothing', 'Apparel', 'Accessories'];
    targetMarket = 'Fashion-conscious consumers';
    brandPositioning = 'Style that makes a statement';
  }

  return {
    businessModel,
    industry,
    products,
    targetMarket,
    brandPositioning,
    rawResearch: `Mock research for ${url}. Business appears to be in the ${industry} industry operating as ${businessModel}.`,
  };
}
