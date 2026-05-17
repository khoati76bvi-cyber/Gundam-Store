"use client";

import { useRouter } from "next/navigation";

export default function UserActions({ user }: { user: any }) {
  const router = useRouter();

  async function toggleActive() {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: !user.active,
      }),
    });

    router.refresh();
  }

  async function deleteUser() {
    const ok = confirm(`Xóa user ${user.name}?`);

    if (!ok) return;

    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
      }),
    });

    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleActive}
        className={`rounded-xl px-3 py-2 text-sm font-bold text-white transition ${
          user.active
            ? "bg-yellow-600 hover:bg-yellow-500"
            : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {user.active ? "Disable" : "Enable"}
      </button>

      <button
        onClick={deleteUser}
        className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-500"
      >
        Delete
      </button>
    </div>
  );
}
