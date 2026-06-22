import Link from "next/link";
import { Ticket, Urgency } from "@/lib/types";
import { TicketStamp } from "./ticket-stamp";
import { Avatar } from "@/components/ui/avatar";
import { getUser } from "@/lib/mock";
import { timeAgo } from "@/lib/utils/format";
import { Paperclip, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const URGENCY_BORDER: Record<Urgency, string> = {
  LOW: "border-l-urgency-low",
  MEDIUM: "border-l-urgency-medium",
  HIGH: "border-l-urgency-high",
  CRITICAL: "border-l-urgency-critical",
};

export function TicketBoardCard({ ticket }: { ticket: Ticket }) {
  const requester = getUser(ticket.createdById);

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className={cn(
        "block rounded-lg border border-border bg-card p-3 hover:border-border-strong hover:shadow-sm transition-all border-l-[3px]",
        URGENCY_BORDER[ticket.urgency]
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <TicketStamp id={ticket.id} urgency={ticket.urgency} size="sm" />
      </div>
      <p className="text-sm font-medium text-ink leading-snug mb-2 line-clamp-2">{ticket.title}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-ink-faint">
          {ticket.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]">
              <Paperclip className="h-3 w-3" /> {ticket.attachments.length}
            </span>
          )}
          {ticket.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]">
              <MessageSquare className="h-3 w-3" /> {ticket.comments.length}
            </span>
          )}
          <span className="text-[11px]">{timeAgo(ticket.updatedAt)}</span>
        </div>
        {requester && <Avatar name={requester.name} size="sm" />}
      </div>
    </Link>
  );
}
