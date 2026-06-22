import Link from "next/link";
import { Ticket } from "@/lib/types";
import { TicketStamp } from "./ticket-stamp";
import { StatusBadge } from "./badges";
import { Avatar } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils/format";
import { getUser } from "@/lib/mock";
import { DEPARTMENT_LABEL } from "@/lib/utils/ticket-style";
import { Paperclip, MessageSquare } from "lucide-react";

export function TicketRow({ ticket, showRequester = false }: { ticket: Ticket; showRequester?: boolean }) {
  const requester = getUser(ticket.createdById);
  const assignee = ticket.assignedToId ? getUser(ticket.assignedToId) : null;

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group flex items-center gap-4 px-4 py-3 border-b border-border hover:bg-canvas-subtle transition-colors"
    >
      <TicketStamp id={ticket.id} urgency={ticket.urgency} size="sm" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate group-hover:text-accent transition-colors">{ticket.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-ink-faint">{DEPARTMENT_LABEL[ticket.department]}</span>
          {showRequester && requester && (
            <>
              <span className="text-ink-faint">·</span>
              <span className="text-xs text-ink-faint">{requester.name}</span>
            </>
          )}
          <span className="text-ink-faint">·</span>
          <span className="text-xs text-ink-faint">{timeAgo(ticket.updatedAt)}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 text-ink-faint">
        {ticket.attachments.length > 0 && (
          <span className="flex items-center gap-1 text-xs">
            <Paperclip className="h-3 w-3" />
            {ticket.attachments.length}
          </span>
        )}
        {ticket.comments.length > 0 && (
          <span className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-3 w-3" />
            {ticket.comments.length}
          </span>
        )}
      </div>

      <StatusBadge status={ticket.status} />

      {assignee ? (
        <Avatar name={assignee.name} size="sm" />
      ) : (
        <div className="h-6 w-6 rounded-full border border-dashed border-border-strong" title="Unassigned" />
      )}
    </Link>
  );
}
