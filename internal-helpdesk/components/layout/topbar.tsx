"use client";
import * as React from "react";
import { Search, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Avatar } from "@/components/ui/avatar";
import { NotificationsPopover } from "@/components/notifications/notifications-popover";
import { User } from "@/lib/types";

export function Topbar({ user, onSearch }: { user: User; onSearch?: (q: string) => void }) {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = React.useState("");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-canvas/95 backdrop-blur px-4 md:px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          placeholder="Search tickets... (⌘K)"
          className="w-full h-8 rounded-md border border-border bg-canvas-subtle pl-8 pr-3 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent"
        />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="h-8 w-8 flex items-center justify-center rounded-md text-ink-muted hover:bg-canvas-inset hover:text-ink transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <NotificationsPopover userId={user.id} />

        <div className="flex items-center gap-2 ml-1 pl-2.5 border-l border-border">
          <Avatar name={user.name} size="sm" />
          <div className="hidden lg:flex flex-col leading-none">
            <span className="text-xs font-medium text-ink">{user.name}</span>
            <span className="text-[10px] text-ink-faint">{user.title || user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
