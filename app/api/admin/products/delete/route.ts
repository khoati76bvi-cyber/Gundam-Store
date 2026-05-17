import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

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
