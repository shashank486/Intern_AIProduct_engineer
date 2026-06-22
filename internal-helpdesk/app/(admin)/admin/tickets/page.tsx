"use client";
import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { tickets as allTickets } from "@/lib/mock";
import { TicketRow } from "@/components/tickets/ticket-row";
import { FilterBar, applyFilters, defaultFilters } from "@/components/tickets/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileSearch, Download } from "lucide-react";
import { ticketsToCSV, downloadCSV } from "@/lib/utils/csv-export";
import { toast } from "sonner";

export default function AdminTicketsPage() {
  const [filters, setFilters] = React.useState(defaultFilters);
  const [query, setQuery] = React.useState("");

  const filtered = applyFilters(allTickets, filters).filter(
    (t) => query.trim() === "" || t.title.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase())
  );

  function handleExport() {
    const csv = ticketsToCSV(filtered);
    downloadCSV(`tickets-export-${new Date().toISOString().slice(0, 10)}.csv`, csv);
    toast.success(`Exported ${filtered.length} tickets to CSV`);
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-ink tracking-tight">All tickets</h1>
          <p className="text-sm text-ink-faint mt-0.5">{allTickets.length} tickets across every department</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
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
