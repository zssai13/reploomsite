import { NextResponse } from 'next/server';

// Debug endpoint to check environment configuration
// Access at /api/debug/env
export async function GET() {
  const envCheck = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    apiKeys: {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
        ? `✓ Set (${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...)`
        : '✗ NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
        ? '✓ Set'
        : '✗ NOT SET',
    },
    filesystem: {
      isVercel: process.env.VERCEL === '1',
      writeDir: process.env.VERCEL === '1' ? '/tmp' : '.data & public/uploads',
      note: process.env.VERCEL === '1'
        ? 'Running on Vercel - filesystem writes go to /tmp (ephemeral)'
        : 'Running locally - filesystem writes persist',
    },
    recommendations: [] as string[],
  };

  // Add recommendations based on issues found
  if (!process.env.ANTHROPIC_API_KEY) {
    envCheck.recommendations.push(
      'Set ANTHROPIC_API_KEY in Vercel project settings: Settings > Environment Variables'
    );
  }
  if (!process.env.NEXTAUTH_SECRET) {
    envCheck.recommendations.push(
      'Set NEXTAUTH_SECRET in Vercel project settings (generate with: openssl rand -base64 32)'
    );
  }
  if (process.env.VERCEL === '1') {
    envCheck.recommendations.push(
      'Note: On Vercel, newly generated pages are stored in /tmp and will be lost on function restart. Consider using Vercel KV for persistent data.'
    );
  }

  return NextResponse.json(envCheck);
}
