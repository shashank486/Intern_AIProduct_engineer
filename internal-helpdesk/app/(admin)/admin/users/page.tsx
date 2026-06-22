"use client";
import { AppShell } from "@/components/layout/app-shell";
import { users, getTicketsByEmployee, getTicketsByAgent } from "@/lib/mock";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DEPARTMENT_LABEL } from "@/lib/utils/ticket-style";
import { Card } from "@/components/ui/card";

const roleStyles: Record<string, string> = {
  EMPLOYEE: "text-ink-muted",
  AGENT: "text-signal-progress",
  ADMIN: "text-accent",
};

export default function AdminUsersPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink tracking-tight">Users</h1>
        <p className="text-sm text-ink-faint mt-0.5">{users.length} people across the organization</p>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-ink-faint">Name</th>
              <th className="px-4 py-2.5 text-xs font-medium text-ink-faint">Role</th>
              <th className="px-4 py-2.5 text-xs font-medium text-ink-faint">Department</th>
              <th className="px-4 py-2.5 text-xs font-medium text-ink-faint">Email</th>
              <th className="px-4 py-2.5 text-xs font-medium text-ink-faint text-right">Tickets</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const ticketCount =
                u.role === "EMPLOYEE" ? getTicketsByEmployee(u.id).length : u.role === "AGENT" ? getTicketsByAgent(u.id).length : "—";
              return (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-canvas-subtle transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="text-xs font-medium text-ink">{u.name}</p>
                        <p className="text-[10px] text-ink-faint">{u.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-2.5 text-xs font-medium ${roleStyles[u.role]}`}>{u.role}</td>
                  <td className="px-4 py-2.5">
                    {u.department ? <Badge variant="outline">{DEPARTMENT_LABEL[u.department]}</Badge> : <span className="text-ink-faint text-xs">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-ink-muted">{u.email}</td>
                  <td className="px-4 py-2.5 text-xs text-ink text-right">{ticketCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
