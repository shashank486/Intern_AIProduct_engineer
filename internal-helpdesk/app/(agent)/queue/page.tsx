"use client";
import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "@/components/layout/session-provider";
import { getTicketsByDepartment } from "@/lib/mock";
import { computeStats } from "@/lib/utils/stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { TicketBoard } from "@/components/tickets/ticket-board";
import { TicketRow } from "@/components/tickets/ticket-row";
import { FilterBar, applyFilters, defaultFilters } from "@/components/tickets/filter-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Ticket, Clock, Loader2, CheckCircle2, LayoutGrid, List, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AgentQueuePage() {
  const { user } = useSession();
  const department = user.department || "IT";
  const deptTickets = getTicketsByDepartment(department);
  const stats = computeStats(deptTickets);
  const [view, setView] = React.useState<"board" | "list">("board");
  const [filters, setFilters] = React.useState(defaultFilters);
  const [query, setQuery] = React.useState("");

  const filtered = applyFilters(deptTickets, filters).filter(
    (t) => query.trim() === "" || t.title.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-ink tracking-tight">My queue</h1>
          <p className="text-sm text-ink-faint mt-0.5">All open tickets in your department</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total" value={stats.total} icon={Ticket} />
        <StatCard label="Open" value={stats.open} icon={Clock} accentClass="text-signal-open" />
        <StatCard label="In progress" value={stats.inProgress} icon={Loader2} accentClass="text-signal-progress" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accentClass="text-signal-resolved" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tickets..." className="w-52 pl-8" />
          </div>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as "board" | "list")}>
          <TabsList>
            <TabsTrigger value="board">
              <LayoutGrid className="h-3.5 w-3.5 mr-1.5" /> Board
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-3.5 w-3.5 mr-1.5" /> List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Queue is empty" description="No tickets match your current filters." />
      ) : view === "board" ? (
        <TicketBoard tickets={filtered} />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {filtered.map((t) => (
            <TicketRow key={t.id} ticket={t} showRequester />
          ))}
        </div>
      )}
    </AppShell>
  );
}
