"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { DepartmentSlug, Urgency } from "@/lib/types";
import { DEPARTMENT_LABEL } from "@/lib/utils/ticket-style";
import { getDepartment } from "@/lib/mock";

const URGENCY_HEX: Record<Urgency, string> = {
  LOW: "hsl(152 50% 45%)",
  MEDIUM: "hsl(45 90% 52%)",
  HIGH: "hsl(22 90% 55%)",
  CRITICAL: "hsl(354 78% 56%)",
};

export function DepartmentBarChart({ data }: { data: { department: DepartmentSlug; count: number }[] }) {
  const chartData = data.map((d) => ({
    name: DEPARTMENT_LABEL[d.department],
    count: d.count,
    fill: `hsl(${getDepartment(d.department)?.color})`,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="name" stroke="hsl(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} width={28} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
            color: "hsl(var(--ink))",
          }}
          cursor={{ fill: "hsl(var(--canvas-inset))" }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function UrgencyDonutChart({ data }: { data: { urgency: Urgency; count: number }[] }) {
  const chartData = data.filter((d) => d.count > 0).map((d) => ({ name: d.urgency, value: d.count, fill: URGENCY_HEX[d.urgency] }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
            color: "hsl(var(--ink))",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "hsl(var(--ink-muted))" }}
          formatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
