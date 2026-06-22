"use client";
import { AppShell } from "@/components/layout/app-shell";
import { tickets } from "@/lib/mock";
import { computeStats, ticketsByDepartment, ticketsByUrgency, dailyTrend, monthlyTrend } from "@/lib/utils/stats";
import { TrendChart } from "@/components/charts/trend-chart";
import { DepartmentBarChart, UrgencyDonutChart } from "@/components/charts/breakdown-charts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { departments } from "@/lib/mock";
import { DEPARTMENT_LABEL } from "@/lib/utils/ticket-style";
import { formatHours } from "@/lib/utils/format";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminAnalyticsPage() {
  const daily = dailyTrend(tickets, 14);
  const monthly = monthlyTrend(tickets, 6);
  const urgencyData = ticketsByUrgency(tickets);
  const deptData = ticketsByDepartment(tickets);

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink tracking-tight">Analytics</h1>
        <p className="text-sm text-ink-faint mt-0.5">Trends and breakdowns across the helpdesk</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket trend</CardTitle>
          <CardDescription>Created vs. resolved over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList className="mb-3">
              <TabsTrigger value="daily">Daily (14d)</TabsTrigger>
              <TabsTrigger value="monthly">Monthly (6mo)</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <TrendChart data={daily} xKey="date" />
            </TabsContent>
            <TabsContent value="monthly">
              <TrendChart data={monthly} xKey="month" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by department</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBarChart data={deptData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tickets by priority</CardTitle>
          </CardHeader>
          <CardContent>
            <UrgencyDonutChart data={urgencyData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department performance</CardTitle>
          <CardDescription>Volume and average resolution time per team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {departments.map((d) => {
              const deptTickets = tickets.filter((t) => t.department === d.slug);
              const stats = computeStats(deptTickets);
              return (
                <div key={d.slug} className="rounded-lg border border-border p-3.5">
                  <p className="text-xs font-semibold text-ink mb-2">{DEPARTMENT_LABEL[d.slug]}</p>
                  <div className="space-y-1.5">
                    <Row label="Total" value={stats.total} />
                    <Row label="Open" value={stats.open} />
                    <Row label="Resolved" value={stats.resolved} />
                    <Row label="Avg. resolution" value={stats.avgResolutionHours ? formatHours(stats.avgResolutionHours) : "—"} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-ink-faint">{label}</span>
      <span className="text-xs font-medium text-ink">{value}</span>
    </div>
  );
}
