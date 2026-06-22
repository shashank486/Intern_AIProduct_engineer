import { cn } from "@/lib/utils/cn";
import { Urgency } from "@/lib/types";
import { URGENCY_CONFIG } from "@/lib/utils/ticket-style";

export function TicketStamp({ id, urgency, size = "default" }: { id: string; urgency: Urgency; size?: "sm" | "default" }) {
  const cfg = URGENCY_CONFIG[urgency];
  return (
    <span
      className={cn(
        "ticket-stamp inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 font-medium",
        size === "sm" ? "text-[10px]" : "text-xs",
        cfg.bg,
        cfg.border,
        cfg.text
      )}
      title={`${cfg.label} urgency`}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.bar)} />
      {id}
    </span>
  );
}
