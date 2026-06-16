// ─── FILE: components/UserMenu.tsx ───
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Shield, LogOut } from "lucide-react";

interface UserMenuProps {
  name: string;
  email: string;
  isAdmin?: boolean;
}

export default function UserMenu({ name, email, isAdmin = false }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const initial = (name?.trim()?.charAt(0) || "V").toUpperCase();

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg mx-1 hover:bg-muted transition-colors cursor-pointer";

  return (
    <div ref={wrapperRef} className="relative">
      {/* Avatar trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open user menu"
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-shadow hover:ring-2 hover:ring-border focus:outline-none focus-visible:ring-2 focus-visible:ring-border bg-muted text-foreground border border-border"
      >
        {initial}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-border bg-popover shadow-xl py-1 origin-top-right opacity-100 translate-y-0 transition-all duration-150 animate-in"
        >
          {/* Identity header (non-clickable) */}
          <div className="flex items-center gap-3 px-3 py-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #7C3AED)" }}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight truncate">{name}</div>
              <div className="text-xs text-muted-foreground truncate">{email}</div>
            </div>
          </div>

          <div className="border-t border-border my-1" />

          {/* Nav links */}
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
            Dashboard
          </Link>
          <Link
            href="/learn"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            Learn
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <Shield className="w-4 h-4 text-muted-foreground" />
              Admin Panel
            </Link>
          )}

          <div className="border-t border-border my-1" />

          {/* Sign out (danger) */}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              role="menuitem"
              className={`${itemClass} w-[calc(100%-0.5rem)] text-red-500 hover:bg-red-500/10 hover:text-red-500`}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
// ─── END FILE ───
