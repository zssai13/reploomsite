import { NextResponse } from 'next/server';
import { getStorageType } from '@/lib/db';

// Debug endpoint to check environment configuration
// Access at /api/debug/env
export async function GET() {
  const storageType = getStorageType();
  const isKvConfigured = !!process.env.KV_REST_API_URL;

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
    storage: {
      provider: storageType,
      kvConfigured: isKvConfigured,
      KV_REST_API_URL: isKvConfigured
        ? `✓ Set (${process.env.KV_REST_API_URL?.substring(0, 30)}...)`
        : '✗ NOT SET',
      status: isKvConfigured
        ? '✓ Using Vercel KV (persistent storage)'
        : process.env.VERCEL === '1'
          ? '⚠ Using file storage on Vercel (data will not persist!)'
          : '✓ Using file storage (local development)',
    },
    migration: {
      endpoint: '/api/admin/migrate-to-kv',
      checkStatus: 'GET /api/admin/migrate-to-kv',
      runMigration: 'POST /api/admin/migrate-to-kv with Authorization: Bearer <MIGRATION_SECRET>',
      migrationSecretSet: !!process.env.MIGRATION_SECRET,
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
  if (process.env.VERCEL === '1' && !isKvConfigured) {
    envCheck.recommendations.push(
      'CRITICAL: Set up Vercel KV for persistent storage. Go to Vercel Dashboard > Storage > Create Database > KV'
    );
  }
  if (isKvConfigured && !process.env.MIGRATION_SECRET) {
    envCheck.recommendations.push(
      'Set MIGRATION_SECRET env var to enable data migration from files to KV'
    );
  }

  return NextResponse.json(envCheck);
}
