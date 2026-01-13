// Storage provider interface for database operations
// Implementations: file-storage.ts (local), kv-storage.ts (Vercel KV)

import type { GeneratedPage, Testimonial, Settings, TestimonialEntry, BenefitFocus } from '@/types';

export interface StorageProvider {
  // Pages
  getAllPages(): Promise<GeneratedPage[]>;
  getPageById(id: string): Promise<GeneratedPage | null>;
  getPageBySlug(slug: string): Promise<GeneratedPage | null>;
  createPage(page: GeneratedPage): Promise<void>;
  updatePage(id: string, updates: Partial<GeneratedPage>): Promise<void>;
  deletePage(id: string): Promise<void>;
  searchPages(query: string): Promise<GeneratedPage[]>;

  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: string): Promise<Testimonial | null>;
  getTestimonialsByIds(ids: string[]): Promise<Testimonial[]>;
  getTestimonialsByType(businessType: string): Promise<Testimonial[]>;
  createTestimonial(testimonial: Testimonial): Promise<void>;
  deleteTestimonial(id: string): Promise<void>;

  // Testimonial Bank
  getTestimonialBank(): Promise<TestimonialEntry[]>;
  saveTestimonialBank(testimonials: TestimonialEntry[]): Promise<void>;
  getTestimonialBankByFocus(focus: BenefitFocus): Promise<TestimonialEntry[]>;
  getTestimonialBankByIndustry(industry: string): Promise<TestimonialEntry[]>;
  updateTestimonialInBank(id: string, updates: Partial<TestimonialEntry>): Promise<void>;

  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(updates: Partial<Settings>): Promise<Settings>;
}
