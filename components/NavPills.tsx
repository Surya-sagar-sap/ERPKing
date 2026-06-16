// ─── FILE: components/NavPills.tsx ───
"use client";

import { Flame, Star } from "lucide-react";

interface NavPillsProps {
  xp: number;
  streak: number;
}

export default function NavPills({ xp, streak }: NavPillsProps) {
  return (
    <div className="hidden sm:flex items-center gap-2">
      {streak > 0 && (
        <div className="flex items-center gap-1 text-sm font-semibold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">
          <Flame className="w-4 h-4" />
          <span>{streak}d</span>
        </div>
      )}
      <div className="flex items-center gap-1.5 text-sm bg-yellow-500/10 px-2.5 py-1 rounded-full">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="font-semibold text-foreground">{xp}</span>
        <span className="text-muted-foreground">XP</span>
      </div>
    </div>
  );
}
// ─── END FILE ───
