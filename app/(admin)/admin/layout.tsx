import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, FileText, HelpCircle, Award, BarChart3, Users, DollarSign, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/modules", label: "Modules", icon: BookOpen },
  { href: "/admin/lessons", label: "Lessons", icon: FileText },
  { href: "/admin/quizzes", label: "Quizzes", icon: HelpCircle },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-16 md:w-56 shrink-0 border-r bg-card flex flex-col">
        {/* Logo */}
        <div className="px-3 md:px-5 py-4 border-b flex items-center justify-center md:justify-start gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.svg" alt="Learn ERP" width={28} height={28} className="w-7 h-7 rounded-lg shrink-0" />
          <div className="hidden md:block">
            <div className="font-bold text-sm leading-none">Learn ERP</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 md:px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className="flex items-center justify-center md:justify-start gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 md:px-3 pb-4 space-y-1 border-t pt-3">
          <Link
            href="/dashboard"
            title="Back to App"
            className="flex items-center justify-center md:justify-start gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">Back to App</span>
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button title="Sign out" className="w-full flex items-center justify-center md:justify-start gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
