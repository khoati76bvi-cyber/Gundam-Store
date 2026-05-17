"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();

    setLoading(true);

    const form = new FormData(e.target);

    await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });

    location.reload();
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 rounded-3xl border border-white/10 bg-[#0B1220] p-6"
    >
      <h2 className="text-2xl font-black">Tạo user mới</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          name="name"
          placeholder="Tên"
          className="rounded-2xl border border-white/10 bg-black px-4 py-4"
        />

        <input
          name="email"
          placeholder="Email"
          className="rounded-2xl border border-white/10 bg-black px-4 py-4"
        />

        <input
          name="password"
          placeholder="Password"
          className="rounded-2xl border border-white/10 bg-black px-4 py-4"
        />

        <select
          name="role"
          className="rounded-2xl border border-white/10 bg-black px-4 py-4"
        >
          <option>ADMIN</option>
          <option>EDITOR</option>
          <option>SALES</option>
          <option>WAREHOUSE</option>
          <option>SUPPORT</option>
        </select>
      </div>

      <button
        disabled={loading}
        className="mt-6 rounded-2xl bg-red-600 px-6 py-4 font-bold"
      >
        {loading ? "Đang tạo..." : "Tạo user"}
      </button>
    </form>
  );
}
