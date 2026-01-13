// Database layer with local JSON fallback for development
// Uses Vercel KV in production, local files in development
// IMPORTANT: On Vercel serverless, filesystem is read-only except /tmp

import { promises as fs } from 'fs';
import path from 'path';
import type { GeneratedPage, Testimonial, Settings, TestimonialEntry, BenefitFocus } from '@/types';

// Detect if running on Vercel
const IS_VERCEL = process.env.VERCEL === '1';

// On Vercel, use /tmp for writes; locally use .data
const DATA_DIR = IS_VERCEL ? '/tmp/.data' : path.join(process.cwd(), '.data');

// For reading existing data (deployed with the app)
const DEPLOYED_DATA_DIR = path.join(process.cwd(), '.data');

const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json');
const TESTIMONIAL_BANK_FILE = path.join(DATA_DIR, 'testimonial-bank.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Deployed file paths (read-only on Vercel)
const DEPLOYED_PAGES_FILE = path.join(DEPLOYED_DATA_DIR, 'pages.json');
const DEPLOYED_TESTIMONIALS_FILE = path.join(DEPLOYED_DATA_DIR, 'testimonials.json');
const DEPLOYED_TESTIMONIAL_BANK_FILE = path.join(DEPLOYED_DATA_DIR, 'testimonial-bank.json');
const DEPLOYED_SETTINGS_FILE = path.join(DEPLOYED_DATA_DIR, 'settings.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory exists or can't be created
  }
}

// Generic file read/write helpers
// On Vercel, tries /tmp first, then falls back to deployed data
async function readJsonFile<T>(filePath: string, defaultValue: T, deployedFilePath?: string): Promise<T> {
  await ensureDataDir();

  // First try the primary path (on Vercel this is /tmp)
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If on Vercel and we have a deployed path, try that
    if (IS_VERCEL && deployedFilePath) {
      try {
        const data = await fs.readFile(deployedFilePath, 'utf-8');
        return JSON.parse(data);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[DB] Failed to write file: ${errorMsg}`);
    throw new Error(`Database write failed: ${errorMsg}. On Vercel, data written to /tmp is ephemeral.`);
  }
}

// ============ PAGES ============

export async function getAllPages(): Promise<GeneratedPage[]> {
  const pages = await readJsonFile<GeneratedPage[]>(PAGES_FILE, [], DEPLOYED_PAGES_FILE);
  return pages.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getPageById(id: string): Promise<GeneratedPage | null> {
  const pages = await getAllPages();
  return pages.find(p => p.id === id) || null;
}

export async function getPageBySlug(slug: string): Promise<GeneratedPage | null> {
  const pages = await getAllPages();
  return pages.find(p => p.slug === slug) || null;
}

export async function createPage(page: GeneratedPage): Promise<void> {
  const pages = await getAllPages();
  pages.push(page);
  await writeJsonFile(PAGES_FILE, pages);
}

export async function updatePage(id: string, updates: Partial<GeneratedPage>): Promise<void> {
  const pages = await getAllPages();
  const index = pages.findIndex(p => p.id === id);
  if (index !== -1) {
    pages[index] = { ...pages[index], ...updates };
    await writeJsonFile(PAGES_FILE, pages);
  }
}

export async function deletePage(id: string): Promise<void> {
  const pages = await getAllPages();
  const filtered = pages.filter(p => p.id !== id);
  await writeJsonFile(PAGES_FILE, filtered);
}

export async function searchPages(query: string): Promise<GeneratedPage[]> {
  const pages = await getAllPages();
  const lowerQuery = query.toLowerCase();
  return pages.filter(p =>
    p.referenceName.toLowerCase().includes(lowerQuery) ||
    p.companyName.toLowerCase().includes(lowerQuery) ||
    (p.businessUrl?.toLowerCase().includes(lowerQuery) ?? false)
  );
}

// ============ TESTIMONIALS ============

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return readJsonFile<Testimonial[]>(TESTIMONIALS_FILE, [], DEPLOYED_TESTIMONIALS_FILE);
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const testimonials = await getAllTestimonials();
  return testimonials.find(t => t.id === id) || null;
}

export async function getTestimonialsByIds(ids: string[]): Promise<Testimonial[]> {
  const testimonials = await getAllTestimonials();
  return ids.map(id => testimonials.find(t => t.id === id)).filter(Boolean) as Testimonial[];
}

export async function getTestimonialsByType(businessType: string): Promise<Testimonial[]> {
  const testimonials = await getAllTestimonials();
  return testimonials.filter(t => t.businessType === businessType);
}

export async function createTestimonial(testimonial: Testimonial): Promise<void> {
  const testimonials = await getAllTestimonials();
  testimonials.push(testimonial);
  await writeJsonFile(TESTIMONIALS_FILE, testimonials);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const testimonials = await getAllTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  await writeJsonFile(TESTIMONIALS_FILE, filtered);
}

// ============ TESTIMONIAL BANK (Rich testimonials for AI selection) ============

export async function getTestimonialBank(): Promise<TestimonialEntry[]> {
  return readJsonFile<TestimonialEntry[]>(TESTIMONIAL_BANK_FILE, [], DEPLOYED_TESTIMONIAL_BANK_FILE);
}

export async function saveTestimonialBank(testimonials: TestimonialEntry[]): Promise<void> {
  await writeJsonFile(TESTIMONIAL_BANK_FILE, testimonials);
}

export async function getTestimonialBankByFocus(focus: BenefitFocus): Promise<TestimonialEntry[]> {
  const bank = await getTestimonialBank();
  return bank.filter(t => t.benefitFocus === focus);
}

export async function getTestimonialBankByIndustry(industry: string): Promise<TestimonialEntry[]> {
  const bank = await getTestimonialBank();
  const lowerIndustry = industry.toLowerCase();
  return bank.filter(t =>
    t.industry.toLowerCase().includes(lowerIndustry) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerIndustry))
  );
}

export async function updateTestimonialInBank(id: string, updates: Partial<TestimonialEntry>): Promise<void> {
  const bank = await getTestimonialBank();
  const index = bank.findIndex(t => t.id === id);
  if (index !== -1) {
    bank[index] = { ...bank[index], ...updates };
    await saveTestimonialBank(bank);
  }
}

// ============ SETTINGS ============

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

export async function getSettings(): Promise<Settings> {
  return readJsonFile<Settings>(SETTINGS_FILE, DEFAULT_SETTINGS, DEPLOYED_SETTINGS_FILE);
}

export async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}
