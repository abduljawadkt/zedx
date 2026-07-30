"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { isLight, setTheme, theme, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        className="grid size-9 place-items-center rounded-full border border-[var(--shell-border)] bg-[var(--shell-soft)] text-[var(--brand-blue)] transition hover:scale-110 hover:text-[var(--brand-blue-soft)] active:scale-95"
        onClick={toggleTheme}
      >
        {isLight ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
      </button>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 rounded-full border border-[var(--shell-border)] bg-[var(--shell-soft)] p-1">
      {[
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "light" as const, label: "Light", icon: Sun },
      ].map((item) => {
        const Icon = item.icon;
        const selected = theme === item.value;

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={selected}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition",
              selected
                ? "bg-[var(--foreground)] text-[var(--background)] shadow-sm"
                : "text-[var(--muted)] hover:bg-[var(--shell-panel)] hover:text-[var(--foreground)]",
            )}
            onClick={() => setTheme(item.value)}
          >
            <Icon size={16} strokeWidth={1.8} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
