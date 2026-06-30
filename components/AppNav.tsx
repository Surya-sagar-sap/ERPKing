// ─── FILE: components/AppNav.tsx ───
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import NavPills from "@/components/NavPills";
import UserMenu from "@/components/UserMenu";

export type Crumb = { label: string; href?: string };

interface AppNavProps {
  name: string;
  email: string;
  isAdmin?: boolean;
  /** Quick-glance stats. Pills are hidden when showPills is false. */
  xp?: number;
  streak?: number;
  showPills?: boolean;
  /** Tabs layout: which tab is active. Used when `breadcrumbs` is not provided. */
  active?: "dashboard" | "learn";
  /** Breadcrumb layout: trail shown left of the nav. Overrides tabs. */
  breadcrumbs?: Crumb[];
  /** Optional extra nodes on the right, before the avatar (e.g. lesson pills). */
  rightExtra?: ReactNode;
}

const tabBase = "px-3 py-1.5 text-sm rounded-lg transition-colors";
const tabActive = `${tabBase} font-medium bg-background shadow-sm border border-border text-foreground`;
const tabIdle = `${tabBase} text-muted-foreground hover:bg-muted hover:text-foreground`;

export default function AppNav({
  name,
  email,
  isAdmin = false,
  xp = 0,
  streak = 0,
  showPills = true,
  active,
  breadcrumbs,
  rightExtra,
}: AppNavProps) {
  return (
    <nav className="border-b border-border/60 h-14 bg-background/80 backdrop-blur-xl sticky top-0 z-20 w-full">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.svg" alt="Learn ERP" width={32} height={32} className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-base">Learn ERP</span>
        </Link>

        {/* Center: breadcrumb trail OR tabs */}
        {breadcrumbs ? (
          <div className="hidden sm:flex items-center gap-1.5 ml-4 text-sm text-muted-foreground min-w-0">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${i}`}>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors truncate max-w-[160px]">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium truncate max-w-[220px]">{crumb.label}</span>
                  )}
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1 ml-6">
            <Link href="/dashboard" className={active === "dashboard" ? tabActive : tabIdle}>
              Dashboard
            </Link>
            <Link href="/learn" className={active === "learn" ? tabActive : tabIdle}>
              Learn
            </Link>
          </div>
        )}

        {/* Right: optional extras + stats pills + avatar dropdown */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {rightExtra}
          {showPills && <NavPills xp={xp} streak={streak} />}
          <UserMenu name={name} email={email} isAdmin={isAdmin} />
        </div>
      </div>
    </nav>
  );
}
// ─── END FILE ───
