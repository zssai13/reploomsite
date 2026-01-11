// File storage layer with local fallback for development
// Uses Vercel Blob in production, local files in development

import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
async function ensureUploadsDir(subdir?: string) {
  const dir = subdir ? path.join(UPLOADS_DIR, subdir) : UPLOADS_DIR;
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // Directory exists
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
 * In production: would use Vercel Blob
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
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  await fs.writeFile(filePath, buffer);

  // Return public URL
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
 */
export async function readTextFile(url: string): Promise<string | null> {
  if (url.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', url);
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
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
