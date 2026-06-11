import { prisma } from "@/lib/prisma";
import { BookOpen, FileText, Users, HelpCircle, Eye, EyeOff } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    moduleCount,
    publishedModules,
    lessonCount,
    publishedLessons,
    userCount,
    quizCount,
  ] = await Promise.all([
    prisma.module.count(),
    prisma.module.count({ where: { isPublished: true } }),
    prisma.lesson.count(),
    prisma.lesson.count({ where: { isPublished: true } }),
    prisma.user.count(),
    prisma.quiz.count(),
  ]);

  const recentModules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { lessons: true } } },
    take: 5,
  });

  const stats = [
    { label: "Total Modules", value: moduleCount, sub: `${publishedModules} published`, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
    { label: "Total Lessons", value: lessonCount, sub: `${publishedLessons} published`, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Total Users", value: userCount, sub: "registered learners", icon: Users, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
    { label: "Total Quizzes", value: quizCount, sub: "across all lessons", icon: HelpCircle, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your SAP learning platform content</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="border rounded-xl p-5 bg-card">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="font-medium text-sm mt-0.5">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Module status */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Modules</h2>
          <a href="/admin/modules" className="text-sm text-primary hover:underline">Manage all →</a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">#</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Module</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Lessons</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentModules.map((mod) => (
              <tr key={mod.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-6 py-3 text-muted-foreground">{mod.order}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{mod.icon}</span>
                    <div>
                      <div className="font-medium">{mod.title}</div>
                      <div className="text-xs text-muted-foreground">{mod.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-muted-foreground">{mod._count.lessons}</td>
                <td className="px-6 py-3">
                  {mod.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
