// File-based storage implementation for local development
// This stores data in JSON files in the .data directory

import { promises as fs } from 'fs';
import path from 'path';
import type { StorageProvider } from './storage-interface';
import type { GeneratedPage, Testimonial, Settings, TestimonialEntry, BenefitFocus } from '@/types';

// Data directory - uses local .data folder
const DATA_DIR = path.join(process.cwd(), '.data');

const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');
const TESTIMONIAL_BANK_FILE = path.join(DATA_DIR, 'testimonial-bank.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory exists
  }
}

// Generic file read/write helpers
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

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
  const pages = await readJsonFile<GeneratedPage[]>(PAGES_FILE, []);
  return pages.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
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
  await writeJsonFile(PAGES_FILE, pages);
}

async function updatePage(id: string, updates: Partial<GeneratedPage>): Promise<void> {
  const pages = await getAllPages();
  const index = pages.findIndex(p => p.id === id);
  if (index !== -1) {
    pages[index] = { ...pages[index], ...updates };
    await writeJsonFile(PAGES_FILE, pages);
  }
}

async function deletePage(id: string): Promise<void> {
  const pages = await getAllPages();
  const filtered = pages.filter(p => p.id !== id);
  await writeJsonFile(PAGES_FILE, filtered);
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
  return readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, []);
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
  await writeJsonFile(TESTIMONIALS_FILE, testimonials);
}

async function deleteTestimonial(id: string): Promise<void> {
  const testimonials = await getAllTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  await writeJsonFile(TESTIMONIALS_FILE, filtered);
}

// ============ TESTIMONIAL BANK ============

async function getTestimonialBank(): Promise<TestimonialEntry[]> {
  return readJsonFile<TestimonialEntry[]>(TESTIMONIAL_BANK_FILE, []);
}

async function saveTestimonialBank(testimonials: TestimonialEntry[]): Promise<void> {
  await writeJsonFile(TESTIMONIAL_BANK_FILE, testimonials);
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
  return readJsonFile<Settings>(SETTINGS_FILE, DEFAULT_SETTINGS);
}

async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}

// Export as StorageProvider
export const fileStorage: StorageProvider = {
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
