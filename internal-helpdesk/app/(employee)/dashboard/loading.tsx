import { Skeleton } from "@/components/ui/skeleton";
import { StatCardSkeleton } from "@/components/tickets/skeletons";
import { TicketListSkeleton } from "@/components/tickets/skeletons";

export default function Loading() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <TicketListSkeleton />
    </div>
  );
}
