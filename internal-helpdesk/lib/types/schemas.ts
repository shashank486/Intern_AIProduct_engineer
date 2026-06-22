import { z } from "zod";

export const ticketFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120, "Title is too long"),
  description: z.string().min(20, "Please describe the issue in more detail (at least 20 characters)"),
  department: z.enum(["IT", "HR", "FINANCE", "ADMIN_DEPT"], { required_error: "Select a department" }),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], { required_error: "Select an urgency level" }),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
