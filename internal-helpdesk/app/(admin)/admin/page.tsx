"use client";
import { AppShell } from "@/components/layout/app-shell";
import { tickets } from "@/lib/mock";
import { computeStats, ticketsByDepartment, ticketsByUrgency, dailyTrend } from "@/lib/utils/stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendChart } from "@/components/charts/trend-chart";
import { DepartmentBarChart, UrgencyDonutChart } from "@/components/charts/breakdown-charts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TicketRow } from "@/components/tickets/ticket-row";
import { Ticket, Clock, Loader2, CheckCircle2, Timer } from "lucide-react";
import { formatHours } from "@/lib/utils/format";

export default function AdminOverviewPage() {
  const stats = computeStats(tickets);
  const deptData = ticketsByDepartment(tickets);
  const urgencyData = ticketsByUrgency(tickets);
  const trend = dailyTrend(tickets, 14);
  const recent = [...tickets].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6);

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink tracking-tight">Overview</h1>
        <p className="text-sm text-ink-faint mt-0.5">Organization-wide ticket activity across all departments</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total tickets" value={stats.total} icon={Ticket} />
        <StatCard label="Open" value={stats.open} icon={Clock} accentClass="text-signal-open" />
        <StatCard label="In progress" value={stats.inProgress} icon={Loader2} accentClass="text-signal-progress" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accentClass="text-signal-resolved" />
        <StatCard
          label="Avg. resolution"
          value={stats.avgResolutionHours ? formatHours(stats.avgResolutionHours) : "—"}
          icon={Timer}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily ticket trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={trend} xKey="date" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets by urgency</CardTitle>
          </CardHeader>
          <CardContent>
            <UrgencyDonutChart data={urgencyData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tickets by department</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBarChart data={deptData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recently submitted</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-border">
              {recent.map((t) => (
                <TicketRow key={t.id} ticket={t} showRequester />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
