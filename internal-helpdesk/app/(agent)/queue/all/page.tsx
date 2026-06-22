"use client";
import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { tickets as allTickets } from "@/lib/mock";
import { TicketRow } from "@/components/tickets/ticket-row";
import { FilterBar, applyFilters, defaultFilters } from "@/components/tickets/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Search, FileSearch } from "lucide-react";

export default function AllTicketsPage() {
  const [filters, setFilters] = React.useState({ ...defaultFilters });
  const [query, setQuery] = React.useState("");

  const filtered = applyFilters(allTickets, filters).filter(
    (t) => query.trim() === "" || t.title.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-ink tracking-tight">All department tickets</h1>
        <p className="text-sm text-ink-faint mt-0.5">Visibility across every department's queue</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tickets..." className="w-56 pl-8" />
        </div>
        <FilterBar filters={filters} onChange={setFilters} showDepartment />
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={FileSearch} title="No tickets match your filters" />
        ) : (
          filtered.map((t) => <TicketRow key={t.id} ticket={t} showRequester />)
        )}
      </div>
    </AppShell>
  );
}
