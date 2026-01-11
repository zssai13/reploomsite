import { NextResponse } from 'next/server';
import { getAllTestimonials, createTestimonial, deleteTestimonial } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import type { Testimonial } from '@/types';

export async function GET() {
  try {
    const testimonials = await getAllTestimonials();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Failed to get testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const testimonial: Testimonial = {
      id: uuidv4(),
      imageUrl: body.imageUrl,
      businessName: body.businessName,
      businessType: body.businessType,
      industry: body.industry,
      adSpendRange: body.adSpendRange,
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
    };

    await createTestimonial(testimonial);
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing id' },
        { status: 400 }
      );
    }

    await deleteTestimonial(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
