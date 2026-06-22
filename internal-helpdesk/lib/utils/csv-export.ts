import { Ticket } from "@/lib/types";
import { getUser } from "@/lib/mock";
import { DEPARTMENT_LABEL } from "@/lib/utils/ticket-style";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function ticketsToCSV(tickets: Ticket[]): string {
  const headers = ["ID", "Title", "Department", "Status", "Urgency", "Requester", "Assignee", "Created", "Updated", "Resolved"];
  const rows = tickets.map((t) => {
    const requester = getUser(t.createdById)?.name || "";
    const assignee = t.assignedToId ? getUser(t.assignedToId)?.name || "" : "Unassigned";
    return [
      t.id,
      t.title,
      DEPARTMENT_LABEL[t.department],
      t.status,
      t.urgency,
      requester,
      assignee,
      t.createdAt,
      t.updatedAt,
      t.resolvedAt || "",
    ]
      .map((v) => escapeCsvField(String(v)))
      .join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
