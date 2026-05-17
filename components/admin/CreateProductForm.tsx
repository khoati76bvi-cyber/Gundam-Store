"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
    category: "MG",
    badge: "NEW",
    price: "",
    stock: "",
  });

  async function submit(e: any) {
    e.preventDefault();

    setLoading(true);

    await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });

    setLoading(false);

    router.push("/admin/products");

    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-white/10 bg-[#0B1220] p-8"
    >
      <div className="grid grid-cols-2 gap-5">
        <input
          placeholder="Tên sản phẩm"
          className="rounded-2xl bg-black px-5 py-4 text-white"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Slug"
          className="rounded-2xl bg-black px-5 py-4 text-white"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <input
          placeholder="/products/freedom.png"
          className="rounded-2xl bg-black px-5 py-4 text-white"
          value={form.image}
          onChange={(e) =>
            setForm({
              ...form,
              image: e.target.value,
            })
          }
        />

        <select
          className="rounded-2xl bg-black px-5 py-4 text-white"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        >
          <option>MG</option>
          <option>RG</option>
          <option>HG</option>
          <option>PG</option>
        </select>

        <input
          placeholder="Badge"
          className="rounded-2xl bg-black px-5 py-4 text-white"
          value={form.badge}
          onChange={(e) =>
            setForm({
              ...form,
              badge: e.target.value,
            })
          }
        />

        <input
          placeholder="Price"
          type="number"
          className="rounded-2xl bg-black px-5 py-4 text-white"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
        />

        <input
          placeholder="Stock"
          type="number"
          className="rounded-2xl bg-black px-5 py-4 text-white"
          value={form.stock}
          onChange={(e) =>
            setForm({
              ...form,
              stock: e.target.value,
            })
          }
        />
      </div>

      <button
        disabled={loading}
        className="mt-8 rounded-2xl bg-red-600 px-6 py-4 font-bold text-white hover:bg-red-500"
      >
        {loading ? "Creating..." : "Tạo sản phẩm"}
      </button>
    </form>
  );
}
