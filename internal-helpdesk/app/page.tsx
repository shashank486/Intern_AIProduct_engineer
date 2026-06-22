"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/layout/session-provider";

const roleHome: Record<string, string> = { EMPLOYEE: "/dashboard", AGENT: "/queue", ADMIN: "/admin" };

export default function Home() {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    router.replace(roleHome[user.role] || "/dashboard");
  }, [user.role, router]);

  return null;
}
