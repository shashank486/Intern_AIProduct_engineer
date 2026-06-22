"use client";
import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "@/components/layout/session-provider";
import { getTicketsByEmployee } from "@/lib/mock";
import { TicketRow } from "@/components/tickets/ticket-row";
import { FilterBar, applyFilters, defaultFilters } from "@/components/tickets/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, FileSearch } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MyTicketsPage() {
  const { user } = useSession();
  const allTickets = getTicketsByEmployee(user.id);
  const [filters, setFilters] = React.useState(defaultFilters);
  const [query, setQuery] = React.useState("");

  const filtered = applyFilters(allTickets, filters).filter(
    (t) => query.trim() === "" || t.title.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-ink tracking-tight">My tickets</h1>
          <p className="text-sm text-ink-faint mt-0.5">{allTickets.length} total requests</p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <PlusCircle className="h-4 w-4" />
            New ticket
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or ID..."
            className="w-56 pl-8"
          />
        </div>
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileSearch}
            title="No tickets match your filters"
            description="Try adjusting the status or urgency filters, or clear your search."
          />
        ) : (
          filtered.map((t) => <TicketRow key={t.id} ticket={t} />)
        )}
      </div>
    </AppShell>
  );
}
