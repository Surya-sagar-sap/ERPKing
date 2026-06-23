"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton({
  action,
  message = "Are you sure? This cannot be undone.",
}: {
  action: () => Promise<void>;
  message?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        aria-label="Delete"
        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-muted-foreground dark:hover:bg-red-950"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
