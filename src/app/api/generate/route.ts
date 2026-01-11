import { NextResponse } from 'next/server';
import { generatePages } from '@/lib/ai/generation';
import type { PageGenerationInput } from '@/types';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Get required file uploads
    const logoFile = formData.get('companyLogo') as File | null;
    const researchFile = formData.get('businessResearch') as File | null;

    // Validate required file uploads
    if (!logoFile || logoFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Company logo is required' },
        { status: 400 }
      );
    }

    if (!researchFile || researchFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Business research file is required' },
        { status: 400 }
      );
    }

    // Extract form fields
    const input: PageGenerationInput = {
      referenceName: formData.get('referenceName') as string,
      companyName: formData.get('companyName') as string,
      businessUrl: (formData.get('businessUrl') as string) || undefined,
      companyLogo: logoFile,
      businessResearch: researchFile,
      loomVideoUrl: formData.get('loomVideoUrl') as string,
      adSpend: Number(formData.get('adSpend')),
      adRevenue: Number(formData.get('adRevenue')),
      primaryProductLink: formData.get('primaryProductLink') as string,
      primaryProductPrice: Number(formData.get('primaryProductPrice')),
      downsellProductLink: formData.get('downsellProductLink') as string,
      downsellProductPrice: Number(formData.get('downsellProductPrice')),
    };

    // Validate required text fields
    if (!input.referenceName || !input.companyName || !input.loomVideoUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate the pages
    const page = await generatePages(input);

    return NextResponse.json({
      success: true,
      data: {
        pageId: page.id,
        slug: page.slug,
      },
    });
  } catch (error) {
    console.error('Generation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Generation failed' },
      { status: 500 }
    );
  }
}
