import { Skeleton } from "@/components/ui/skeleton";

export function TicketRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border">
      <Skeleton className="h-5 w-20" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/5" />
        <Skeleton className="h-2.5 w-2/5" />
      </div>
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  );
}

export function TicketListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <TicketRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-16" />
    </div>
  );
}
