"use client";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "@/components/layout/session-provider";
import { useTheme } from "@/components/layout/theme-provider";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function SettingsPage() {
  const { user } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-ink tracking-tight">Settings</h1>
          <p className="text-sm text-ink-faint mt-0.5">Manage your profile and preferences</p>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="lg" />
              <div>
                <p className="text-sm font-medium text-ink">{user.name}</p>
                <p className="text-xs text-ink-faint">{user.email}</p>
                <p className="text-xs text-ink-faint">{user.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how Helpdesk looks on your device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <button
                onClick={() => theme !== "dark" && toggleTheme()}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                  theme === "dark" ? "border-accent" : "border-border hover:border-border-strong"
                )}
              >
                <Moon className="h-4 w-4 text-ink" />
                <span className="text-xs text-ink">Dark</span>
              </button>
              <button
                onClick={() => theme !== "light" && toggleTheme()}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                  theme === "light" ? "border-accent" : "border-border hover:border-border-strong"
                )}
              >
                <Sun className="h-4 w-4 text-ink" />
                <span className="text-xs text-ink">Light</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
