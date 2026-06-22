"use client";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { useSession } from "./session-provider";
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  useKeyboardShortcuts();
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar role={user.role} department={user.department} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 p-4 md:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
