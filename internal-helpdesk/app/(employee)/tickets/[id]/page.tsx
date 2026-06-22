import { AppShell } from "@/components/layout/app-shell";
import { TicketDetailView } from "@/components/tickets/ticket-detail-view";
import { getTicketById } from "@/lib/mock";
import { notFound } from "next/navigation";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = getTicketById(params.id);
  if (!ticket) notFound();

  return (
    <AppShell>
      <TicketDetailView ticket={ticket} />
    </AppShell>
  );
}
