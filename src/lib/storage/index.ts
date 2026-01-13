// File storage layer with local fallback for development
// Uses Vercel Blob in production, local files in development
// IMPORTANT: On Vercel serverless, filesystem is read-only except /tmp

import { promises as fs } from 'fs';
import path from 'path';

// Detect if running on Vercel
const IS_VERCEL = process.env.VERCEL === '1';

// On Vercel, use /tmp for writes; locally use public/uploads
const UPLOADS_DIR = IS_VERCEL
  ? '/tmp/uploads'
  : path.join(process.cwd(), 'public', 'uploads');

// For reading existing files (deployed with the app)
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
async function ensureUploadsDir(subdir?: string) {
  const dir = subdir ? path.join(UPLOADS_DIR, subdir) : UPLOADS_DIR;
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // Directory exists or can't be created
  }
  return dir;
}

export type UploadType = 'logos' | 'testimonials' | 'testimonial-logos' | 'rag';

export interface UploadResult {
  url: string;
  filename: string;
}

/**
 * Upload a file to storage
 * In development: saves to public/uploads folder
 * On Vercel: saves to /tmp (ephemeral) and returns a data URL for images
 */
export async function uploadFile(
  file: File | Buffer,
  filename: string,
  type: UploadType
): Promise<UploadResult> {
  const dir = await ensureUploadsDir(type);
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = path.join(dir, safeName);

  // Convert File to Buffer if needed
  let buffer: Buffer;
  let mimeType = 'application/octet-stream';
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    mimeType = file.type || mimeType;
  } else {
    buffer = file;
  }

  try {
    await fs.writeFile(filePath, buffer);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Storage] Failed to write file: ${errorMsg}`);
    throw new Error(`Storage write failed: ${errorMsg}. On Vercel, consider using Vercel Blob for persistent storage.`);
  }

  // On Vercel with /tmp, the file won't be publicly accessible via URL
  // For images, we'll return a data URL; for other files, return the tmp path
  if (IS_VERCEL && (type === 'logos' || type === 'testimonials' || type === 'testimonial-logos')) {
    // Return data URL for images on Vercel (works for embedding in pages)
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return { url: dataUrl, filename: safeName };
  }

  // Return public URL (works locally and for files deployed with the app)
  const url = `/uploads/${type}/${safeName}`;
  return { url, filename: safeName };
}

/**
 * Delete a file from storage
 */
export async function deleteFile(url: string): Promise<void> {
  // Extract path from URL
  if (url.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', url);
    try {
      await fs.unlink(filePath);
    } catch {
      // File doesn't exist, ignore
    }
  }
}

/**
 * Read a text file from storage (for RAG documents)
 * On Vercel, tries both the deployed public/uploads and /tmp
 */
export async function readTextFile(url: string): Promise<string | null> {
  if (url.startsWith('/uploads/')) {
    // First try the deployed public/uploads (for files deployed with the app)
    const publicPath = path.join(PUBLIC_UPLOADS_DIR, url.replace('/uploads/', ''));
    try {
      return await fs.readFile(publicPath, 'utf-8');
    } catch {
      // If not found in public, try /tmp on Vercel
      if (IS_VERCEL) {
        const tmpPath = path.join('/tmp/uploads', url.replace('/uploads/', ''));
        try {
          return await fs.readFile(tmpPath, 'utf-8');
        } catch {
          return null;
        }
      }
      return null;
    }
  }
  return null;
}

/**
 * Check if file exists
 */
export async function fileExists(url: string): Promise<boolean> {
  if (url.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', url);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
