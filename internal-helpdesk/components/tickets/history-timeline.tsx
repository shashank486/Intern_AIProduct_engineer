import { TicketHistoryEntry } from "@/lib/types";
import { getUser } from "@/lib/mock";
import { formatDateTime } from "@/lib/utils/format";
import { STATUS_CONFIG } from "@/lib/utils/ticket-style";
import { PlusCircle, UserCheck, RefreshCw, MessageSquare, Pencil, RotateCcw } from "lucide-react";

const ICONS: Record<TicketHistoryEntry["type"], React.ElementType> = {
  CREATED: PlusCircle,
  ASSIGNED: UserCheck,
  STATUS_CHANGE: RefreshCw,
  COMMENT_ADDED: MessageSquare,
  PRIORITY_CHANGE: RefreshCw,
  EDITED: Pencil,
  REOPENED: RotateCcw,
};

function describeEntry(entry: TicketHistoryEntry): string {
  const actor = getUser(entry.actorId)?.name || "Someone";
  switch (entry.type) {
    case "CREATED":
      return `${actor} created this ticket`;
    case "ASSIGNED":
      return `${actor} was assigned`;
    case "STATUS_CHANGE": {
      const from = entry.fromValue ? STATUS_CONFIG[entry.fromValue as keyof typeof STATUS_CONFIG]?.label : null;
      const to = entry.toValue ? STATUS_CONFIG[entry.toValue as keyof typeof STATUS_CONFIG]?.label : null;
      return from && to ? `${actor} moved status from ${from} to ${to}` : `${actor} updated the status`;
    }
    case "COMMENT_ADDED":
      return `${actor} added a comment`;
    case "PRIORITY_CHANGE":
      return `${actor} changed the urgency`;
    case "EDITED":
      return `${actor} edited the ticket`;
    case "REOPENED":
      return `${actor} reopened the ticket`;
    default:
      return `${actor} updated the ticket`;
  }
}

export function HistoryTimeline({ history }: { history: TicketHistoryEntry[] }) {
  const sorted = [...history].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  return (
    <div className="space-y-0">
      {sorted.map((entry, i) => {
        const Icon = ICONS[entry.type];
        const isLast = i === sorted.length - 1;
        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-canvas-inset flex items-center justify-center shrink-0">
                <Icon className="h-3 w-3 text-ink-faint" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border my-1" />}
            </div>
            <div className="pb-4 min-w-0">
              <p className="text-xs text-ink">{describeEntry(entry)}</p>
              <p className="text-[10px] text-ink-faint mt-0.5">{formatDateTime(entry.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
