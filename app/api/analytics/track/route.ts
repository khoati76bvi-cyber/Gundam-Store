import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await prisma.analyticsEvent.create({
      data: {
        sessionId: String(body.sessionId || 'anonymous'),
        userId: body.userId ? String(body.userId) : undefined,
        type: String(body.type || 'EVENT'),
        path: body.path ? String(body.path) : undefined,
        productId: body.productId ? Number(body.productId) : undefined,
        productSlug: body.productSlug ? String(body.productSlug) : undefined,
        productName: body.productName ? String(body.productName) : undefined,
        bannerId: body.bannerId ? Number(body.bannerId) : undefined,
        keyword: body.keyword ? String(body.keyword).toLowerCase().trim() : undefined,
        value: body.value ? Number(body.value) : undefined,
        metadata: JSON.stringify(body.metadata || {})
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
