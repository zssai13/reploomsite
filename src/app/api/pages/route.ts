import { NextResponse } from 'next/server';
import { getAllPages, searchPages } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const pages = search ? await searchPages(search) : await getAllPages();

    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    console.error('Failed to get pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get pages' },
      { status: 500 }
    );
  }
}
