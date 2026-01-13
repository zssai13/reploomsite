// Vercel KV (Redis) storage implementation for production
// This stores data persistently in Vercel's managed Redis (via Upstash)

import { createClient } from '@vercel/kv';
import type { StorageProvider } from './storage-interface';
import type { GeneratedPage, Testimonial, Settings, TestimonialEntry, BenefitFocus } from '@/types';

// Create KV client with Upstash env vars (prefixed with hyroskv_)
// Falls back to standard KV_* env vars if the prefixed ones don't exist
const kv = createClient({
  url: process.env.hyroskv_KV_REST_API_URL || process.env.KV_REST_API_URL || '',
  token: process.env.hyroskv_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || '',
});

// Redis key constants - prefixed to avoid collisions
const KEYS = {
  PAGES: 'hyros:pages',
  TESTIMONIALS: 'hyros:testimonials',
  TESTIMONIAL_BANK: 'hyros:testimonial-bank',
  SETTINGS: 'hyros:settings',
} as const;

// Default settings
const DEFAULT_SETTINGS: Settings = {
  hyrosLogoUrl: '/images/hyros-logo.png',
  generationSystemPrompt: `You are a sales copywriter for HYROS creating personalized pitch pages.

CRITICAL: Each of the 3 benefits MUST focus on a DIFFERENT specific area:
1. SCALING: How HYROS helps them sell MORE of their specific products. Reference actual product names.
2. COST SAVINGS: How HYROS stops wasted ad spend on losing campaigns.
3. AI TARGETING: How feeding HYROS data to Meta/Google/TikTok improves their targeting.

PERSONALIZATION REQUIREMENTS:
- Reference their specific products by name
- Use their business model context throughout
- Mention their industry specifically
- Select testimonials from the bank that match their business type

TONE: Direct, confident, results-focused. No fluff. Show them you understand their business.

This page should feel custom-written for THIS prospect, not a generic template.`,
  ragDocuments: {
    salesKnowledgeBase: null,
    businessIntelDossier: null,
    salesTranscripts: null,
  },
  testimonialBankRaw: null,
  updatedAt: new Date().toISOString(),
};

// ============ PAGES ============

async function getAllPages(): Promise<GeneratedPage[]> {
  try {
    const pages = await kv.get<GeneratedPage[]>(KEYS.PAGES);
    if (!pages) return [];
    return pages.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('[KV] Error getting pages:', error);
    return [];
  }
}

async function getPageById(id: string): Promise<GeneratedPage | null> {
  const pages = await getAllPages();
  return pages.find(p => p.id === id) || null;
}

async function getPageBySlug(slug: string): Promise<GeneratedPage | null> {
  const pages = await getAllPages();
  return pages.find(p => p.slug === slug) || null;
}

async function createPage(page: GeneratedPage): Promise<void> {
  const pages = await getAllPages();
  pages.push(page);
  await kv.set(KEYS.PAGES, pages);
  console.log(`[KV] Created page: ${page.slug}`);
}

async function updatePage(id: string, updates: Partial<GeneratedPage>): Promise<void> {
  const pages = await getAllPages();
  const index = pages.findIndex(p => p.id === id);
  if (index !== -1) {
    pages[index] = { ...pages[index], ...updates };
    await kv.set(KEYS.PAGES, pages);
    console.log(`[KV] Updated page: ${id}`);
  }
}

async function deletePage(id: string): Promise<void> {
  const pages = await getAllPages();
  const filtered = pages.filter(p => p.id !== id);
  await kv.set(KEYS.PAGES, filtered);
  console.log(`[KV] Deleted page: ${id}`);
}

async function searchPages(query: string): Promise<GeneratedPage[]> {
  const pages = await getAllPages();
  const lowerQuery = query.toLowerCase();
  return pages.filter(p =>
    p.referenceName.toLowerCase().includes(lowerQuery) ||
    p.companyName.toLowerCase().includes(lowerQuery) ||
    (p.businessUrl?.toLowerCase().includes(lowerQuery) ?? false)
  );
}

// ============ TESTIMONIALS ============

async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await kv.get<Testimonial[]>(KEYS.TESTIMONIALS);
    return testimonials || [];
  } catch (error) {
    console.error('[KV] Error getting testimonials:', error);
    return [];
  }
}

async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const testimonials = await getAllTestimonials();
  return testimonials.find(t => t.id === id) || null;
}

async function getTestimonialsByIds(ids: string[]): Promise<Testimonial[]> {
  const testimonials = await getAllTestimonials();
  return ids.map(id => testimonials.find(t => t.id === id)).filter(Boolean) as Testimonial[];
}

async function getTestimonialsByType(businessType: string): Promise<Testimonial[]> {
  const testimonials = await getAllTestimonials();
  return testimonials.filter(t => t.businessType === businessType);
}

async function createTestimonial(testimonial: Testimonial): Promise<void> {
  const testimonials = await getAllTestimonials();
  testimonials.push(testimonial);
  await kv.set(KEYS.TESTIMONIALS, testimonials);
}

async function deleteTestimonial(id: string): Promise<void> {
  const testimonials = await getAllTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  await kv.set(KEYS.TESTIMONIALS, filtered);
}

// ============ TESTIMONIAL BANK ============

async function getTestimonialBank(): Promise<TestimonialEntry[]> {
  try {
    const bank = await kv.get<TestimonialEntry[]>(KEYS.TESTIMONIAL_BANK);
    return bank || [];
  } catch (error) {
    console.error('[KV] Error getting testimonial bank:', error);
    return [];
  }
}

async function saveTestimonialBank(testimonials: TestimonialEntry[]): Promise<void> {
  await kv.set(KEYS.TESTIMONIAL_BANK, testimonials);
  console.log(`[KV] Saved testimonial bank: ${testimonials.length} entries`);
}

async function getTestimonialBankByFocus(focus: BenefitFocus): Promise<TestimonialEntry[]> {
  const bank = await getTestimonialBank();
  return bank.filter(t => t.benefitFocus === focus);
}

async function getTestimonialBankByIndustry(industry: string): Promise<TestimonialEntry[]> {
  const bank = await getTestimonialBank();
  const lowerIndustry = industry.toLowerCase();
  return bank.filter(t =>
    t.industry.toLowerCase().includes(lowerIndustry) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerIndustry))
  );
}

async function updateTestimonialInBank(id: string, updates: Partial<TestimonialEntry>): Promise<void> {
  const bank = await getTestimonialBank();
  const index = bank.findIndex(t => t.id === id);
  if (index !== -1) {
    bank[index] = { ...bank[index], ...updates };
    await saveTestimonialBank(bank);
  }
}

// ============ SETTINGS ============

async function getSettings(): Promise<Settings> {
  try {
    const settings = await kv.get<Settings>(KEYS.SETTINGS);
    return settings || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('[KV] Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
}

async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.SETTINGS, updated);
  console.log('[KV] Updated settings');
  return updated;
}

// Export as StorageProvider
export const kvStorage: StorageProvider = {
  getAllPages,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  searchPages,
  getAllTestimonials,
  getTestimonialById,
  getTestimonialsByIds,
  getTestimonialsByType,
  createTestimonial,
  deleteTestimonial,
  getTestimonialBank,
  saveTestimonialBank,
  getTestimonialBankByFocus,
  getTestimonialBankByIndustry,
  updateTestimonialInBank,
  getSettings,
  updateSettings,
};
