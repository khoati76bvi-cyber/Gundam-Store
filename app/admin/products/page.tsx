import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductActions from "@/components/admin/ProductActions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-red-400">
            Product Management
          </p>

          <h1 className="mt-2 text-4xl font-black">Quản lý sản phẩm</h1>
        </div>

        <Link
          href="/admin/products/create"
          className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-500"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]">
        <table className="w-full">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Tên</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Giá</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Badge</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-white/10 hover:bg-white/[0.03]"
              >
                <td className="px-6 py-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-black">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>

                <td className="px-6 py-4 font-bold text-white">{p.name}</td>

                <td className="px-6 py-4 text-white/70">{p.category}</td>

                <td className="px-6 py-4 text-red-400 font-bold">
                  {p.price.toLocaleString("vi-VN")}đ
                </td>

                <td className="px-6 py-4">{p.stock}</td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-400">
                    {p.badge}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ProductActions product={p} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-10 text-center text-white/50">Chưa có sản phẩm</div>
        )}
      </div>
    </div>
  );
}
