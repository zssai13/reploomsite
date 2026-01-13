import { NextResponse } from 'next/server';
import { generatePages } from '@/lib/ai/generation';
import type { PageGenerationInput } from '@/types';

// Helper to create detailed error info for debugging
function getErrorDetails(error: unknown): {
  message: string;
  stack?: string;
  code?: string;
  cause?: string;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      code: (error as NodeJS.ErrnoException).code,
      cause: error.cause ? String(error.cause) : undefined,
    };
  }
  return { message: String(error) };
}

// Check environment configuration
function checkEnvironment(): string[] {
  const issues: string[] = [];

  if (!process.env.ANTHROPIC_API_KEY) {
    issues.push('ANTHROPIC_API_KEY is not set');
  } else if (!process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
    issues.push('ANTHROPIC_API_KEY appears malformed (should start with sk-ant-)');
  }

  if (!process.env.NEXTAUTH_SECRET) {
    issues.push('NEXTAUTH_SECRET is not set');
  }

  return issues;
}

export async function POST(request: Request) {
  const timestamp = new Date().toISOString();

  try {
    // Pre-flight environment check
    const envIssues = checkEnvironment();
    if (envIssues.length > 0) {
      console.error(`[${timestamp}] Environment issues:`, envIssues);
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
          errorCode: 'ENV_CONFIG_ERROR',
          details: envIssues.join('; '),
          timestamp,
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    // Get required file uploads
    const logoFile = formData.get('companyLogo') as File | null;
    const researchFile = formData.get('businessResearch') as File | null;

    // Validate required file uploads
    if (!logoFile || logoFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Company logo is required', errorCode: 'MISSING_LOGO', timestamp },
        { status: 400 }
      );
    }

    if (!researchFile || researchFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Business research file is required', errorCode: 'MISSING_RESEARCH', timestamp },
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
      const missingFields = [];
      if (!input.referenceName) missingFields.push('referenceName');
      if (!input.companyName) missingFields.push('companyName');
      if (!input.loomVideoUrl) missingFields.push('loomVideoUrl');

      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          errorCode: 'MISSING_FIELDS',
          details: `Missing: ${missingFields.join(', ')}`,
          timestamp,
        },
        { status: 400 }
      );
    }

    console.log(`[${timestamp}] Starting generation for: ${input.companyName}`);

    // Generate the pages
    const page = await generatePages(input);

    console.log(`[${timestamp}] Generation successful for: ${input.companyName}, slug: ${page.slug}`);

    return NextResponse.json({
      success: true,
      data: {
        pageId: page.id,
        slug: page.slug,
      },
    });
  } catch (error) {
    const errorDetails = getErrorDetails(error);

    // Log full error details server-side
    console.error(`[${timestamp}] Generation failed:`, {
      message: errorDetails.message,
      code: errorDetails.code,
      stack: errorDetails.stack,
      cause: errorDetails.cause,
    });

    // Determine error category for better debugging
    let errorCode = 'GENERATION_ERROR';
    let userMessage = 'Generation failed';

    if (errorDetails.message.includes('ENOENT') || errorDetails.message.includes('no such file')) {
      errorCode = 'FILE_SYSTEM_ERROR';
      userMessage = 'File system error - storage may not be configured for production';
    } else if (errorDetails.message.includes('ANTHROPIC') || errorDetails.message.includes('401') || errorDetails.message.includes('authentication')) {
      errorCode = 'AI_API_ERROR';
      userMessage = 'AI API error - check ANTHROPIC_API_KEY configuration';
    } else if (errorDetails.message.includes('EACCES') || errorDetails.message.includes('permission')) {
      errorCode = 'PERMISSION_ERROR';
      userMessage = 'Permission error - cannot write to file system in serverless environment';
    } else if (errorDetails.code === 'ENOENT') {
      errorCode = 'FILE_NOT_FOUND';
      userMessage = 'Required file or directory not found';
    }

    return NextResponse.json(
      {
        success: false,
        error: userMessage,
        errorCode,
        details: errorDetails.message,
        timestamp,
        // Include stack trace in development only
        ...(process.env.NODE_ENV === 'development' && { stack: errorDetails.stack }),
      },
      { status: 500 }
    );
  }
}
