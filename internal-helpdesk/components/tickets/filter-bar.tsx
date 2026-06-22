"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DEPARTMENT_LABEL, STATUS_CONFIG, URGENCY_CONFIG } from "@/lib/utils/ticket-style";
import { TicketStatus, Urgency, DepartmentSlug } from "@/lib/types";
import { ArrowDownUp } from "lucide-react";

export interface TicketFilters {
  status: TicketStatus | "ALL";
  urgency: Urgency | "ALL";
  department: DepartmentSlug | "ALL";
  sort: "newest" | "oldest";
}

export function FilterBar({
  filters,
  onChange,
  showDepartment = false,
}: {
  filters: TicketFilters;
  onChange: (filters: TicketFilters) => void;
  showDepartment?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v as TicketFilters["status"] })}>
        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.urgency} onValueChange={(v) => onChange({ ...filters, urgency: v as TicketFilters["urgency"] })}>
        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All urgency</SelectItem>
          {Object.entries(URGENCY_CONFIG).map(([key, cfg]) => (
            <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showDepartment && (
        <Select value={filters.department} onValueChange={(v) => onChange({ ...filters, department: v as TicketFilters["department"] })}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All departments</SelectItem>
            {Object.entries(DEPARTMENT_LABEL).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={filters.sort} onValueChange={(v) => onChange({ ...filters, sort: v as TicketFilters["sort"] })}>
        <SelectTrigger className="w-32">
          <ArrowDownUp className="h-3 w-3 mr-1 text-ink-faint" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function applyFilters<T extends { status: TicketStatus; urgency: Urgency; department: DepartmentSlug; updatedAt: string; createdAt: string }>(
  tickets: T[],
  filters: TicketFilters
): T[] {
  let result = tickets.filter(
    (t) =>
      (filters.status === "ALL" || t.status === filters.status) &&
      (filters.urgency === "ALL" || t.urgency === filters.urgency) &&
      (filters.department === "ALL" || t.department === filters.department)
  );
  result = result.sort((a, b) => {
    const diff = +new Date(b.createdAt) - +new Date(a.createdAt);
    return filters.sort === "newest" ? diff : -diff;
  });
  return result;
}

export const defaultFilters: TicketFilters = { status: "ALL", urgency: "ALL", department: "ALL", sort: "newest" };
