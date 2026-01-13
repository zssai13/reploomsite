// One-time migration endpoint to copy data from deployed .data files to Vercel KV
// Usage: POST /api/admin/migrate-to-kv with Authorization header
//
// This endpoint reads the JSON files deployed with the app and copies them to KV

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { promises as fs } from 'fs';
import path from 'path';

// Redis keys (must match kv-storage.ts)
const KEYS = {
  PAGES: 'hyros:pages',
  TESTIMONIALS: 'hyros:testimonials',
  TESTIMONIAL_BANK: 'hyros:testimonial-bank',
  SETTINGS: 'hyros:settings',
} as const;

export async function POST(request: Request) {
  // Check authorization
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.MIGRATION_SECRET;

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'MIGRATION_SECRET environment variable not set' },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized - invalid or missing Authorization header' },
      { status: 401 }
    );
  }

  // Check if KV is configured
  if (!process.env.KV_REST_API_URL) {
    return NextResponse.json(
      { error: 'Vercel KV not configured - KV_REST_API_URL not set' },
      { status: 500 }
    );
  }

  const DATA_DIR = path.join(process.cwd(), '.data');
  const results: Record<string, string> = {};

  try {
    // Migrate pages
    try {
      const pagesData = await fs.readFile(path.join(DATA_DIR, 'pages.json'), 'utf-8');
      const pages = JSON.parse(pagesData);
      await kv.set(KEYS.PAGES, pages);
      results.pages = `Migrated ${pages.length} pages`;
    } catch (err) {
      results.pages = `Skipped - ${err instanceof Error ? err.message : 'file not found'}`;
    }

    // Migrate testimonial bank
    try {
      const bankData = await fs.readFile(path.join(DATA_DIR, 'testimonial-bank.json'), 'utf-8');
      const bank = JSON.parse(bankData);
      await kv.set(KEYS.TESTIMONIAL_BANK, bank);
      results.testimonialBank = `Migrated ${bank.length} testimonial entries`;
    } catch (err) {
      results.testimonialBank = `Skipped - ${err instanceof Error ? err.message : 'file not found'}`;
    }

    // Migrate settings
    try {
      const settingsData = await fs.readFile(path.join(DATA_DIR, 'settings.json'), 'utf-8');
      const settings = JSON.parse(settingsData);
      await kv.set(KEYS.SETTINGS, settings);
      results.settings = 'Migrated settings';
    } catch (err) {
      results.settings = `Skipped - ${err instanceof Error ? err.message : 'file not found'}`;
    }

    // Migrate testimonials (if exists)
    try {
      const testimonialsData = await fs.readFile(path.join(DATA_DIR, 'testimonials.json'), 'utf-8');
      const testimonials = JSON.parse(testimonialsData);
      await kv.set(KEYS.TESTIMONIALS, testimonials);
      results.testimonials = `Migrated ${testimonials.length} testimonials`;
    } catch (err) {
      // This file may not exist, which is fine
      await kv.set(KEYS.TESTIMONIALS, []);
      results.testimonials = 'Initialized empty (file not found)';
    }

    return NextResponse.json({
      success: true,
      message: 'Migration complete',
      results,
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        results,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check migration status
export async function GET() {
  if (!process.env.KV_REST_API_URL) {
    return NextResponse.json({
      kvConfigured: false,
      message: 'Vercel KV not configured',
    });
  }

  try {
    // Check what data exists in KV
    const pages = await kv.get<unknown[]>(KEYS.PAGES);
    const testimonialBank = await kv.get<unknown[]>(KEYS.TESTIMONIAL_BANK);
    const settings = await kv.get<unknown>(KEYS.SETTINGS);
    const testimonials = await kv.get<unknown[]>(KEYS.TESTIMONIALS);

    return NextResponse.json({
      kvConfigured: true,
      data: {
        pages: pages ? `${pages.length} pages` : 'empty',
        testimonialBank: testimonialBank ? `${testimonialBank.length} entries` : 'empty',
        settings: settings ? 'configured' : 'empty',
        testimonials: testimonials ? `${testimonials.length} testimonials` : 'empty',
      },
    });
  } catch (error) {
    return NextResponse.json({
      kvConfigured: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
