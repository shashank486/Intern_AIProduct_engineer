import { TicketStatus, Urgency } from "@/lib/types";
import { STATUS_CONFIG, URGENCY_CONFIG } from "@/lib/utils/ticket-style";
import { cn } from "@/lib/utils/cn";

export function StatusBadge({ status, className }: { status: TicketStatus; className?: string }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        cfg.bg,
        cfg.border,
        cfg.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot, status === "IN_PROGRESS" && "animate-pulse-dot")} />
      {cfg.label}
    </span>
  );
}

export function UrgencyPill({ urgency, className }: { urgency: Urgency; className?: string }) {
  const cfg = URGENCY_CONFIG[urgency];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", cfg.bg, cfg.border, cfg.text, className)}>
      {cfg.label}
    </span>
  );
}
