"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TrendDatum {
  [key: string]: string | number;
}

export function TrendChart({ data, xKey }: { data: TrendDatum[]; xKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--signal-resolved))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--signal-resolved))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey={xKey} stroke="hsl(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--ink-faint))" fontSize={11} tickLine={false} axisLine={false} width={28} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
            color: "hsl(var(--ink))",
          }}
          labelStyle={{ color: "hsl(var(--ink-faint))" }}
        />
        <Area type="monotone" dataKey="created" stroke="hsl(var(--accent))" fill="url(#createdGradient)" strokeWidth={2} name="Created" />
        <Area type="monotone" dataKey="resolved" stroke="hsl(var(--signal-resolved))" fill="url(#resolvedGradient)" strokeWidth={2} name="Resolved" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
