import { Ticket, DashboardStats, DepartmentSlug, Urgency } from "@/lib/types";

export function computeStats(tickets: Ticket[]): DashboardStats {
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;
  const closed = tickets.filter((t) => t.status === "CLOSED").length;

  const resolvedOrClosed = tickets.filter((t) => t.resolvedAt);
  const avgResolutionHours =
    resolvedOrClosed.length > 0
      ? resolvedOrClosed.reduce((sum, t) => {
          const created = new Date(t.createdAt).getTime();
          const resolved = new Date(t.resolvedAt!).getTime();
          return sum + (resolved - created) / 3600000;
        }, 0) / resolvedOrClosed.length
      : undefined;

  return { total: tickets.length, open, inProgress, resolved, closed, avgResolutionHours };
}

export function ticketsByDepartment(tickets: Ticket[]) {
  const counts: Record<DepartmentSlug, number> = { IT: 0, HR: 0, FINANCE: 0, ADMIN_DEPT: 0 };
  tickets.forEach((t) => counts[t.department]++);
  return Object.entries(counts).map(([dept, count]) => ({ department: dept as DepartmentSlug, count }));
}

export function ticketsByUrgency(tickets: Ticket[]) {
  const counts: Record<Urgency, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  tickets.forEach((t) => counts[t.urgency]++);
  return Object.entries(counts).map(([urgency, count]) => ({ urgency: urgency as Urgency, count }));
}

export function dailyTrend(tickets: Ticket[], days = 14) {
  const buckets: { date: string; created: number; resolved: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);

    const created = tickets.filter((t) => {
      const c = new Date(t.createdAt);
      return c >= d && c < next;
    }).length;

    const resolved = tickets.filter((t) => {
      if (!t.resolvedAt) return false;
      const r = new Date(t.resolvedAt);
      return r >= d && r < next;
    }).length;

    buckets.push({ date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), created, resolved });
  }
  return buckets;
}

export function monthlyTrend(tickets: Ticket[], months = 6) {
  const buckets: { month: string; created: number; resolved: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i, 1);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setMonth(next.getMonth() + 1);

    const created = tickets.filter((t) => {
      const c = new Date(t.createdAt);
      return c >= d && c < next;
    }).length;

    const resolved = tickets.filter((t) => {
      if (!t.resolvedAt) return false;
      const r = new Date(t.resolvedAt);
      return r >= d && r < next;
    }).length;

    buckets.push({ month: d.toLocaleDateString("en-US", { month: "short" }), created, resolved });
  }
  return buckets;
}
