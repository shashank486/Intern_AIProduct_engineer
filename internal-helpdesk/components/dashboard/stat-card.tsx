import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accentClass,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: number; positive: boolean };
  accentClass?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-border-strong">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-faint">{label}</span>
        {Icon && <Icon className={cn("h-3.5 w-3.5 text-ink-faint", accentClass)} />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-ink tracking-tight">{value}</span>
        {trend && (
          <span className={cn("text-xs font-medium", trend.positive ? "text-signal-resolved" : "text-urgency-critical")}>
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}
