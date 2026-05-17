import { prisma } from "@/lib/db";
import CreateUserForm from "@/components/admin/CreateUserForm";
import UserActions from "@/components/admin/UserActions";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-red-400">
            User Management
          </p>

          <h1 className="mt-2 text-4xl font-black">Quản lý người dùng</h1>
        </div>

        <button className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-500">
          + Tạo user
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]">
        <table className="w-full">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="px-6 py-4">Tên</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u: any) => (
              <tr
                key={u.id}
                className="border-t border-white/10 hover:bg-white/[0.03]"
              >
                <td className="px-6 py-4 font-bold text-white">{u.name}</td>

                <td className="px-6 py-4 text-white/70">{u.email}</td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-400">
                    {u.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {u.active ? (
                    <span className="font-bold text-green-400">Active</span>
                  ) : (
                    <span className="font-bold text-red-400">Disabled</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <UserActions user={u} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-10 text-center text-white/50">Chưa có user nào</div>
        )}
      </div>
      <CreateUserForm />
    </div>
  );
}
