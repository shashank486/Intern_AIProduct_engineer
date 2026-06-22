"use client";
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Bell, MessageSquare, UserPlus, RefreshCw, CheckCircle2, AtSign } from "lucide-react";
import Link from "next/link";
import { getNotificationsForUser } from "@/lib/mock";
import { timeAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { NotificationType } from "@/lib/types";

const ICONS: Record<NotificationType, React.ElementType> = {
  TICKET_CREATED: Bell,
  TICKET_ASSIGNED: UserPlus,
  STATUS_CHANGED: RefreshCw,
  COMMENT_ADDED: MessageSquare,
  TICKET_RESOLVED: CheckCircle2,
  MENTIONED: AtSign,
};

export function NotificationsPopover({ userId }: { userId: string }) {
  const items = getNotificationsForUser(userId);
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          aria-label="Notifications"
          className="relative h-8 w-8 flex items-center justify-center rounded-md text-ink-muted hover:bg-canvas-inset hover:text-ink transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-urgency-critical animate-pulse-dot" />
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-lg border border-border bg-card shadow-xl animate-slide-up"
        >
          <div className="flex items-center justify-between px-3.5 py-3 border-b border-border">
            <span className="text-sm font-semibold text-ink">Notifications</span>
            {unreadCount > 0 && <span className="text-xs text-ink-faint">{unreadCount} unread</span>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-3.5 py-6 text-center text-xs text-ink-faint">You&apos;re all caught up.</p>
            ) : (
              items.map((n) => {
                const Icon = ICONS[n.type];
                return (
                  <Link
                    key={n.id}
                    href={`/tickets/${n.ticketId}`}
                    className={cn(
                      "flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-canvas-inset transition-colors border-b border-border last:border-0",
                      !n.read && "bg-accent/5"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 mt-0.5 text-ink-faint shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-ink leading-snug">{n.message}</p>
                      <span className="text-[10px] text-ink-faint">{timeAgo(n.createdAt)}</span>
                    </div>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1 shrink-0" />}
                  </Link>
                );
              })
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
