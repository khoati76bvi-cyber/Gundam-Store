import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name || "New Product",
        slug: body.slug || `product-${Date.now()}`,
        category: body.category || "MG",
        grade: body.category || "MG",
        price: Number(body.price || 0),
        compareAt: 0,
        stock: Number(body.stock || 0),
        image: body.image || "/products/mg-freedom.png",
        gallery: "[]",
        badge: body.badge || "NEW",
        status: "ACTIVE",
        description: "Mô tả sản phẩm",
        specs: "{}",
        featured: false,
      },
    });

    return NextResponse.json(product);
  } catch (e) {
    console.error("PRODUCT_CREATE_ERROR =", e);

    return NextResponse.json(
      { error: "Create failed", detail: String(e) },
      { status: 500 },
    );
  }
}
