"use client";
import * as React from "react";
import { User } from "@/lib/types";
import { users, currentUserId } from "@/lib/mock";

interface SessionContextValue {
  user: User;
  setUserId: (id: string) => void;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);
const STORAGE_KEY = "helpdesk-active-user";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = React.useState(currentUserId);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && users.some((u) => u.id === stored)) setUserIdState(stored);
  }, []);

  const setUserId = React.useCallback((id: string) => {
    setUserIdState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const user = users.find((u) => u.id === userId) || users[0];

  return <SessionContext.Provider value={{ user, setUserId }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
