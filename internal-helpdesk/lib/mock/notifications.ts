import { AppNotification } from "@/lib/types";

const now = () => new Date();
const minsAgo = (n: number) => new Date(now().getTime() - n * 60000).toISOString();

export const notifications: AppNotification[] = [
  {
    id: "n1",
    userId: "u_priya",
    type: "COMMENT_ADDED",
    ticketId: "TKT-2291",
    message: "Rohan Iyer replied on your ticket \"Laptop not connecting to office WiFi\"",
    read: false,
    createdAt: minsAgo(12),
  },
  {
    id: "n2",
    userId: "u_priya",
    type: "STATUS_CHANGED",
    ticketId: "TKT-2291",
    message: "Your ticket moved to In Progress",
    read: false,
    createdAt: minsAgo(95),
  },
  {
    id: "n3",
    userId: "u_priya",
    type: "TICKET_ASSIGNED",
    ticketId: "TKT-2291",
    message: "Rohan Iyer was assigned to your ticket",
    read: true,
    createdAt: minsAgo(60 * 20),
  },
  {
    id: "n4",
    userId: "a_it1",
    type: "TICKET_CREATED",
    ticketId: "TKT-2291",
    message: "New IT ticket from Priya Raman — High urgency",
    read: true,
    createdAt: minsAgo(60 * 22),
  },
];

export const getNotificationsForUser = (userId: string) => notifications.filter((n) => n.userId === userId);
