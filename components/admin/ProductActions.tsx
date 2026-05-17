"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }: { product: any }) {
  const router = useRouter();

  async function deleteProduct() {
    const ok = confirm(`Xóa ${product.name}?`);

    if (!ok) return;

    await fetch("/api/admin/products/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: product.id,
      }),
    });

    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/admin/products/${product.id}`}
        className="rounded-xl bg-cyan-600 px-3 py-2 text-sm font-bold text-white hover:bg-cyan-500"
      >
        Edit
      </Link>

      <button
        onClick={deleteProduct}
        className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-500"
      >
        Delete
      </button>
    </div>
  );
}
