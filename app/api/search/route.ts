import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/search';
import { prisma } from '@/lib/db';

export const revalidate = 60;
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const result = searchProducts({
    q: sp.get('q') || '',
    category: sp.get('category') || 'all',
    grade: sp.get('grade') || 'all',
    sort: sp.get('sort') || 'relevance',
    min: sp.get('min') ? Number(sp.get('min')) : undefined,
    max: sp.get('max') ? Number(sp.get('max')) : undefined,
    page: sp.get('page') ? Number(sp.get('page')) : 1,
    pageSize: sp.get('pageSize') ? Number(sp.get('pageSize')) : 12
  });
  const keyword = (sp.get('q') || '').toLowerCase().trim();
  if (keyword) {
    prisma.searchInsight.create({ data: { keyword, resultCount: result.total || 0 } }).catch(() => {});
    prisma.analyticsEvent.create({ data: { sessionId: req.headers.get('x-gds-session') || 'search-api', type: 'SEARCH', keyword, value: result.total || 0, metadata: JSON.stringify({ category: sp.get('category') || 'all', grade: sp.get('grade') || 'all' }) } }).catch(() => {});
  }
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
    }
  });
}
