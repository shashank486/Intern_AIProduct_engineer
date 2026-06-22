"use client";
import * as React from "react";
import { toast } from "sonner";
import { Ticket, TicketStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_CONFIG, STATUS_FLOW, nextStatus } from "@/lib/utils/ticket-style";
import { getUser } from "@/lib/mock";
import { useSession } from "@/components/layout/session-provider";
import { UserPlus, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function AgentControlPanel({ ticket }: { ticket: Ticket }) {
  const { user } = useSession();
  const [status, setStatus] = React.useState<TicketStatus>(ticket.status);
  const [assignedToId, setAssignedToId] = React.useState(ticket.assignedToId);
  const assignee = assignedToId ? getUser(assignedToId) : null;
  const upcoming = nextStatus(status);

  function assignToSelf() {
    setAssignedToId(user.id);
    toast.success(`Assigned to ${user.name}`);
  }

  function advanceStatus() {
    if (!upcoming) return;
    setStatus(upcoming);
    toast.success(`Status changed to ${STATUS_CONFIG[upcoming].label}`, {
      description: `Ticket ${ticket.id} moved forward in the workflow.`,
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div>
        <p className="text-[11px] text-ink-faint uppercase tracking-wide mb-2">Assignee</p>
        {assignee ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={assignee.name} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-ink truncate">{assignee.name}</p>
              <p className="text-[10px] text-ink-faint truncate">{assignee.title}</p>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={assignToSelf} className="w-full">
            <UserPlus className="h-3.5 w-3.5" />
            Assign to me
          </Button>
        )}
      </div>

      <div className="h-px bg-border" />

      <div>
        <p className="text-[11px] text-ink-faint uppercase tracking-wide mb-2">Status</p>
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {STATUS_FLOW.map((s, i) => {
            const cfg = STATUS_CONFIG[s];
            const isCurrent = s === status;
            const isPast = STATUS_FLOW.indexOf(status) > i;
            return (
              <React.Fragment key={s}>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border",
                    isCurrent ? cn(cfg.bg, cfg.border, cfg.text) : isPast ? "border-border text-ink-faint" : "border-border text-ink-faint opacity-50"
                  )}
                >
                  {isPast && <Check className="h-2.5 w-2.5" />}
                  {cfg.label}
                </span>
                {i < STATUS_FLOW.length - 1 && <ArrowRight className="h-3 w-3 text-ink-faint" />}
              </React.Fragment>
            );
          })}
        </div>
        {upcoming ? (
          <Button size="sm" onClick={advanceStatus} className="w-full">
            Move to {STATUS_CONFIG[upcoming].label}
          </Button>
        ) : (
          <p className="text-[11px] text-ink-faint text-center">Ticket is closed</p>
        )}
      </div>
    </div>
  );
}
