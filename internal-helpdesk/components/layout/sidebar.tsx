"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Ticket,
  PlusCircle,
  Inbox,
  BarChart3,
  Users,
  Settings,
  Laptop,
  Wallet,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Role } from "@/lib/types";
import { RoleSwitcher } from "./role-switcher";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const employeeNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "New ticket", href: "/tickets/new", icon: PlusCircle },
  { label: "My tickets", href: "/tickets", icon: Ticket },
];

const agentNav: NavItem[] = [
  { label: "My queue", href: "/queue", icon: Inbox },
  { label: "All department tickets", href: "/queue/all", icon: Ticket },
];

const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutGrid },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "All tickets", href: "/admin/tickets", icon: Ticket },
  { label: "Users", href: "/admin/users", icon: Users },
];

const deptIcon: Record<string, LucideIcon> = { IT: Laptop, HR: Users, FINANCE: Wallet, ADMIN_DEPT: Building2 };

export function Sidebar({ role, department }: { role: Role; department?: string }) {
  const pathname = usePathname();
  const items = role === "EMPLOYEE" ? employeeNav : role === "AGENT" ? agentNav : adminNav;
  const DeptIcon = department ? deptIcon[department] : null;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-canvas-subtle h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-border">
        <div className="h-6 w-6 rounded-md bg-accent flex items-center justify-center">
          <Ticket className="h-3.5 w-3.5 text-accent-foreground" />
        </div>
        <span className="font-semibold text-sm text-ink tracking-tight">Helpdesk</span>
      </div>

      {department && DeptIcon && (
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
          <DeptIcon className="h-3.5 w-3.5 text-ink-faint" />
          <span className="text-xs font-medium text-ink-muted uppercase tracking-wide">{department.replace("_DEPT", "")} queue</span>
        </div>
      )}

      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-canvas-inset text-ink" : "text-ink-muted hover:bg-canvas-inset hover:text-ink"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-border flex flex-col gap-2">
        <RoleSwitcher />
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-canvas-inset hover:text-ink transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
