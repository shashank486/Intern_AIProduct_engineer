import { TicketStatus, Urgency, DepartmentSlug } from "@/lib/types";
import { LucideIcon, Circle, Loader2, CheckCircle2, Archive } from "lucide-react";

export const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; dot: string; text: string; bg: string; border: string; icon: LucideIcon }
> = {
  OPEN: {
    label: "Open",
    dot: "bg-signal-open",
    text: "text-signal-open",
    bg: "bg-signal-open/10",
    border: "border-signal-open/30",
    icon: Circle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-signal-progress",
    text: "text-signal-progress",
    bg: "bg-signal-progress/10",
    border: "border-signal-progress/30",
    icon: Loader2,
  },
  RESOLVED: {
    label: "Resolved",
    dot: "bg-signal-resolved",
    text: "text-signal-resolved",
    bg: "bg-signal-resolved/10",
    border: "border-signal-resolved/30",
    icon: CheckCircle2,
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-signal-closed",
    text: "text-signal-closed",
    bg: "bg-signal-closed/10",
    border: "border-signal-closed/30",
    icon: Archive,
  },
};

export const URGENCY_CONFIG: Record<Urgency, { label: string; text: string; bg: string; border: string; bar: string }> = {
  LOW: { label: "Low", text: "text-urgency-low", bg: "bg-urgency-low/10", border: "border-urgency-low/30", bar: "bg-urgency-low" },
  MEDIUM: { label: "Medium", text: "text-urgency-medium", bg: "bg-urgency-medium/10", border: "border-urgency-medium/30", bar: "bg-urgency-medium" },
  HIGH: { label: "High", text: "text-urgency-high", bg: "bg-urgency-high/10", border: "border-urgency-high/30", bar: "bg-urgency-high" },
  CRITICAL: { label: "Critical", text: "text-urgency-critical", bg: "bg-urgency-critical/10", border: "border-urgency-critical/30", bar: "bg-urgency-critical" },
};

export const DEPARTMENT_LABEL: Record<DepartmentSlug, string> = {
  IT: "IT",
  HR: "HR",
  FINANCE: "Finance",
  ADMIN_DEPT: "Admin",
};

export const STATUS_FLOW: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export function nextStatus(current: TicketStatus): TicketStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
}
