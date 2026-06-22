"use client";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";

const PALETTE = [
  "bg-blue-500/20 text-blue-400",
  "bg-purple-500/20 text-purple-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-rose-500/20 text-rose-400",
  "bg-cyan-500/20 text-cyan-400",
];

function colorForName(name: string) {
  const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % PALETTE.length;
  return PALETTE[idx];
}

export function Avatar({ name, className, size = "default" }: { name: string; className?: string; size?: "sm" | "default" | "lg" }) {
  const sizeClass = size === "sm" ? "h-6 w-6 text-[10px]" : size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  return (
    <AvatarPrimitive.Root className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizeClass, className)}>
      <AvatarPrimitive.Fallback
        className={cn("flex h-full w-full items-center justify-center font-semibold", colorForName(name))}
      >
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
