import { prisma } from "@/lib/prisma";
import { promoteToAdmin, demoteToLearner } from "./actions";
import { Shield, User } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { progress: true, badges: true } } },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Progress</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">XP / Level</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Joined</th>
              <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  {u.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 px-2.5 py-1 rounded-full font-medium">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                      <User className="w-3 h-3" /> Learner
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {u._count.progress} lessons · {u._count.badges} badges
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {u.xp} XP · Level {u.level}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    {u.role === "ADMIN" ? (
                      <form action={demoteToLearner.bind(null, u.id)}>
                        <button type="submit" className="text-xs text-muted-foreground hover:text-foreground border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                          Remove Admin
                        </button>
                      </form>
                    ) : (
                      <form action={promoteToAdmin.bind(null, u.id)}>
                        <button type="submit" className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                          Make Admin
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
