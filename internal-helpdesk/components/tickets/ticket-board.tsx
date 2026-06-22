import { Ticket, TicketStatus } from "@/lib/types";
import { STATUS_FLOW, STATUS_CONFIG } from "@/lib/utils/ticket-style";
import { TicketBoardCard } from "./ticket-board-card";

export function TicketBoard({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {STATUS_FLOW.map((status) => {
        const cfg = STATUS_CONFIG[status];
        const columnTickets = tickets.filter((t) => t.status === status);
        return (
          <div key={status} className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              <span className="text-xs font-semibold text-ink uppercase tracking-wide">{cfg.label}</span>
              <span className="text-[11px] text-ink-faint ml-auto">{columnTickets.length}</span>
            </div>
            <div className="flex flex-col gap-2.5 rounded-lg bg-canvas-subtle p-2 min-h-[120px]">
              {columnTickets.length === 0 ? (
                <p className="text-[11px] text-ink-faint text-center py-6">No tickets</p>
              ) : (
                columnTickets.map((t) => <TicketBoardCard key={t.id} ticket={t} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
