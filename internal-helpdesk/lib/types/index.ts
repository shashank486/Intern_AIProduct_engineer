// Core domain types for the Internal Helpdesk system.
// These mirror the Prisma schema 1:1 so mock data and real DB data are interchangeable.

export type Role = "EMPLOYEE" | "AGENT" | "ADMIN";

export type DepartmentSlug = "IT" | "HR" | "FINANCE" | "ADMIN_DEPT";

export interface Department {
  id: string;
  slug: DepartmentSlug;
  name: string;
  description: string;
  color: string; // hsl token name, e.g. "210 80% 60%"
  icon: string; // lucide icon name
}

export type Urgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: DepartmentSlug; // required for AGENT, optional otherwise
  avatarUrl?: string;
  title?: string;
}

export interface Attachment {
  id: string;
  ticketId: string;
  fileName: string;
  fileSize: number; // bytes
  fileType: string; // mime
  uploadedById: string;
  uploadedAt: string; // ISO
  isSolutionFile?: boolean;
  url: string; // mock object URL or path
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  body: string; // markdown
  createdAt: string;
  mentions: string[]; // user ids
  isInternal?: boolean; // agent-only note
  attachments?: Attachment[];
}

export interface TicketHistoryEntry {
  id: string;
  ticketId: string;
  type:
    | "CREATED"
    | "ASSIGNED"
    | "STATUS_CHANGE"
    | "COMMENT_ADDED"
    | "PRIORITY_CHANGE"
    | "EDITED"
    | "REOPENED";
  actorId: string;
  fromValue?: string;
  toValue?: string;
  note?: string;
  createdAt: string;
}

export interface AISuggestion {
  id: string;
  ticketId: string;
  predictedDepartment?: DepartmentSlug;
  departmentConfidence?: number; // 0-1
  suggestedUrgency?: Urgency;
  urgencyConfidence?: number;
  generatedTitle?: string;
  duplicateOfTicketIds?: string[];
  troubleshootingSteps?: string[];
  suggestedFirstResponse?: string;
  summary?: string;
  tags?: string[];
  createdAt: string;
}

export interface Ticket {
  id: string; // e.g. TKT-2291
  title: string;
  description: string;
  department: DepartmentSlug;
  urgency: Urgency;
  status: TicketStatus;
  createdById: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  dueAt?: string;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  history: TicketHistoryEntry[];
  aiSuggestion?: AISuggestion;
  watchers?: string[];
  isDuplicateOf?: string;
}

export type NotificationType =
  | "TICKET_CREATED"
  | "TICKET_ASSIGNED"
  | "STATUS_CHANGED"
  | "COMMENT_ADDED"
  | "TICKET_RESOLVED"
  | "MENTIONED";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  ticketId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResolutionHours?: number;
}
