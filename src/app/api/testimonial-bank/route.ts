import { NextResponse } from 'next/server';
import { getTestimonialBank, saveTestimonialBank, updateSettings, getSettings } from '@/lib/db';
import { parseTestimonialsMarkdown } from '@/lib/data/testimonial-parser';
import type { TestimonialEntry } from '@/types';

// GET - Retrieve testimonial bank
export async function GET() {
  try {
    const bank = await getTestimonialBank();
    return NextResponse.json({ success: true, data: bank });
  } catch (error) {
    console.error('Failed to get testimonial bank:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get testimonial bank' },
      { status: 500 }
    );
  }
}

// POST - Upload and parse testimonials markdown file
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read the markdown content
    const markdown = await file.text();

    // Parse testimonials from markdown (logos are extracted from Brand Asset URLs in the MD file)
    const parsedTestimonials = parseTestimonialsMarkdown(markdown);

    if (parsedTestimonials.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No testimonials found in the file' },
        { status: 400 }
      );
    }

    // Save to database (logos already included from Brand Asset URLs)
    await saveTestimonialBank(parsedTestimonials);

    // Also save the raw markdown to settings
    await updateSettings({ testimonialBankRaw: markdown });

    // Count logos found (from Brand Asset URLs in the MD file)
    const logosFound = parsedTestimonials.filter(t => t.logoUrl).length;

    return NextResponse.json({
      success: true,
      data: {
        count: parsedTestimonials.length,
        logosFound,
        testimonials: parsedTestimonials,
      },
    });
  } catch (error) {
    console.error('Failed to process testimonial file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process testimonial file' },
      { status: 500 }
    );
  }
}

// PUT - Update a single testimonial (e.g., to fix logo or classification)
export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID required' },
        { status: 400 }
      );
    }

    const bank = await getTestimonialBank();
    const index = bank.findIndex(t => t.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    bank[index] = { ...bank[index], ...updates };
    await saveTestimonialBank(bank);

    return NextResponse.json({ success: true, data: bank[index] });
  } catch (error) {
    console.error('Failed to update testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE - Clear testimonial bank
export async function DELETE() {
  try {
    await saveTestimonialBank([]);
    await updateSettings({ testimonialBankRaw: null });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to clear testimonial bank:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear testimonial bank' },
      { status: 500 }
    );
  }
}
