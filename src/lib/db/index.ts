// Database layer with automatic storage selection
// Uses Vercel KV when configured, otherwise falls back to file storage
//
// Storage selection:
// - If KV_REST_API_URL is set → Use Vercel KV (persistent, production)
// - Otherwise → Use file storage (local development)

import type { StorageProvider } from './storage-interface';
import { fileStorage } from './file-storage';
import { kvStorage } from './kv-storage';
import type { GeneratedPage, Testimonial, Settings, TestimonialEntry, BenefitFocus } from '@/types';

// Check if KV is configured (supports both Upstash prefixed and standard env vars)
function isKvConfigured(): boolean {
  return !!(process.env.hyroskv_KV_REST_API_URL || process.env.KV_REST_API_URL);
}

// Determine which storage provider to use
function getStorageProvider(): StorageProvider {
  // Use KV if the environment variable is set (Vercel KV / Upstash is configured)
  if (isKvConfigured()) {
    console.log('[DB] Using Vercel KV storage (Upstash)');
    return kvStorage;
  }
  console.log('[DB] Using file-based storage');
  return fileStorage;
}

// Cache the provider selection (happens once per serverless instance)
let storageProvider: StorageProvider | null = null;

function getProvider(): StorageProvider {
  if (!storageProvider) {
    storageProvider = getStorageProvider();
  }
  return storageProvider;
}

// Export which storage is being used (for debugging)
export function getStorageType(): 'kv' | 'file' {
  return isKvConfigured() ? 'kv' : 'file';
}

// ============ PAGES ============

export async function getAllPages(): Promise<GeneratedPage[]> {
  return getProvider().getAllPages();
}

export async function getPageById(id: string): Promise<GeneratedPage | null> {
  return getProvider().getPageById(id);
}

export async function getPageBySlug(slug: string): Promise<GeneratedPage | null> {
  return getProvider().getPageBySlug(slug);
}

export async function createPage(page: GeneratedPage): Promise<void> {
  return getProvider().createPage(page);
}

export async function updatePage(id: string, updates: Partial<GeneratedPage>): Promise<void> {
  return getProvider().updatePage(id, updates);
}

export async function deletePage(id: string): Promise<void> {
  return getProvider().deletePage(id);
}

export async function searchPages(query: string): Promise<GeneratedPage[]> {
  return getProvider().searchPages(query);
}

// ============ TESTIMONIALS ============

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return getProvider().getAllTestimonials();
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  return getProvider().getTestimonialById(id);
}

export async function getTestimonialsByIds(ids: string[]): Promise<Testimonial[]> {
  return getProvider().getTestimonialsByIds(ids);
}

export async function getTestimonialsByType(businessType: string): Promise<Testimonial[]> {
  return getProvider().getTestimonialsByType(businessType);
}

export async function createTestimonial(testimonial: Testimonial): Promise<void> {
  return getProvider().createTestimonial(testimonial);
}

export async function deleteTestimonial(id: string): Promise<void> {
  return getProvider().deleteTestimonial(id);
}

// ============ TESTIMONIAL BANK ============

export async function getTestimonialBank(): Promise<TestimonialEntry[]> {
  return getProvider().getTestimonialBank();
}

export async function saveTestimonialBank(testimonials: TestimonialEntry[]): Promise<void> {
  return getProvider().saveTestimonialBank(testimonials);
}

export async function getTestimonialBankByFocus(focus: BenefitFocus): Promise<TestimonialEntry[]> {
  return getProvider().getTestimonialBankByFocus(focus);
}

export async function getTestimonialBankByIndustry(industry: string): Promise<TestimonialEntry[]> {
  return getProvider().getTestimonialBankByIndustry(industry);
}

export async function updateTestimonialInBank(id: string, updates: Partial<TestimonialEntry>): Promise<void> {
  return getProvider().updateTestimonialInBank(id, updates);
}

// ============ SETTINGS ============

export async function getSettings(): Promise<Settings> {
  return getProvider().getSettings();
}

export async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  return getProvider().updateSettings(updates);
}
