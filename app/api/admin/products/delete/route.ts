import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await prisma.product.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE_PRODUCT_ERROR =", e);

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
