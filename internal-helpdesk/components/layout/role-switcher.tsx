"use client";
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { useSession } from "./session-provider";
import { users } from "@/lib/mock";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";

const roleLabel = { EMPLOYEE: "Employee", AGENT: "Agent", ADMIN: "Admin" };
const roleHome = { EMPLOYEE: "/dashboard", AGENT: "/queue", ADMIN: "/admin" };

export function RoleSwitcher() {
  const { user, setUserId } = useSession();
  const router = useRouter();

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button className="w-full flex items-center gap-2.5 rounded-md border border-border bg-canvas-subtle px-3 py-2 text-left hover:bg-canvas-inset transition-colors">
          <Avatar name={user.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink truncate">{user.name}</p>
            <p className="text-[10px] text-ink-faint">{roleLabel[user.role]}</p>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-ink-faint" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-64 rounded-lg border border-border bg-card shadow-xl p-1.5 animate-slide-up"
        >
          <p className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-faint">Preview as</p>
          {users.map((u) => (
            <PopoverPrimitive.Close asChild key={u.id}>
              <button
                onClick={() => {
                  setUserId(u.id);
                  router.push(roleHome[u.role]);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-canvas-inset transition-colors",
                  u.id === user.id && "bg-canvas-inset"
                )}
              >
                <Avatar name={u.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink truncate">{u.name}</p>
                  <p className="text-[10px] text-ink-faint">
                    {roleLabel[u.role]}
                    {u.department ? ` · ${u.department.replace("_DEPT", "")}` : ""}
                  </p>
                </div>
                {u.id === user.id && <Check className="h-3.5 w-3.5 text-accent" />}
              </button>
            </PopoverPrimitive.Close>
          ))}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
