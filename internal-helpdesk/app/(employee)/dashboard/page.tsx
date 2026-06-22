"use client";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "@/components/layout/session-provider";
import { getTicketsByEmployee } from "@/lib/mock";
import { computeStats } from "@/lib/utils/stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { TicketRow } from "@/components/tickets/ticket-row";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Ticket, Clock, Loader2, CheckCircle2, Archive, PlusCircle, Inbox } from "lucide-react";

export default function EmployeeDashboard() {
  const { user } = useSession();
  const myTickets = getTicketsByEmployee(user.id);
  const stats = computeStats(myTickets);
  const recent = [...myTickets].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 6);

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink tracking-tight">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-ink-faint mt-0.5">Here's what's happening with your support requests.</p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <PlusCircle className="h-4 w-4" />
            New ticket
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total" value={stats.total} icon={Ticket} />
        <StatCard label="Open" value={stats.open} icon={Clock} accentClass="text-signal-open" />
        <StatCard label="In progress" value={stats.inProgress} icon={Loader2} accentClass="text-signal-progress" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accentClass="text-signal-resolved" />
        <StatCard label="Closed" value={stats.closed} icon={Archive} accentClass="text-signal-closed" />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-ink">Recent tickets</h2>
          <Link href="/tickets" className="text-xs text-accent hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No tickets yet"
            description="When something needs IT, HR, Finance, or Admin's attention, raise it here and track it through to resolution."
            action={
              <Button asChild size="sm">
                <Link href="/tickets/new">Create your first ticket</Link>
              </Button>
            }
          />
        ) : (
          <div>
            {recent.map((t) => (
              <TicketRow key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
