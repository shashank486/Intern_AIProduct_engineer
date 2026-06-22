"use client";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useSession } from "@/components/layout/session-provider";
import { ticketFormSchema, TicketFormValues } from "@/lib/types/schemas";
import { Label, Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AIAssistPanel } from "@/components/ai/ai-assist-panel";
import { FileDropzone, PendingFile } from "@/components/tickets/file-dropzone";
import { DEPARTMENT_LABEL, URGENCY_CONFIG } from "@/lib/utils/ticket-style";
import { DepartmentSlug, Urgency } from "@/lib/types";
import { Sparkles } from "lucide-react";

const DEPARTMENTS: DepartmentSlug[] = ["IT", "HR", "FINANCE", "ADMIN_DEPT"];
const URGENCIES: Urgency[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function NewTicketPage() {
  const { user } = useSession();
  const router = useRouter();
  const [files, setFiles] = React.useState<PendingFile[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: { title: "", description: "", department: undefined, urgency: undefined },
  });

  const description = watch("description") || "";

  async function onSubmit(values: TicketFormValues) {
    // In the full-stack build this calls POST /api/tickets which writes via Prisma,
    // triggers notifications, and broadcasts over Socket.IO to the department queue.
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Ticket submitted", {
      description: `${values.title} was routed to ${DEPARTMENT_LABEL[values.department]}.`,
    });
    router.push("/dashboard");
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-ink tracking-tight">New ticket</h1>
          <p className="text-sm text-ink-faint mt-0.5">Describe the issue and we&apos;ll help route it to the right team.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-5 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="e.g. My laptop is not connecting to office WiFi since this morning..."
                  {...register("description")}
                />
                {errors.description && <p className="text-xs text-urgency-critical">{errors.description.message}</p>}
                <p className="text-[11px] text-ink-faint flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI Assist analyzes this as you type
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Short, specific summary" {...register("title")} />
                {errors.title && <p className="text-xs text-urgency-critical">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <Controller
                    control={control}
                    name="department"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {DEPARTMENT_LABEL[d]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.department && <p className="text-xs text-urgency-critical">{errors.department.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Urgency</Label>
                  <Controller
                    control={control}
                    name="urgency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {URGENCIES.map((u) => (
                            <SelectItem key={u} value={u}>
                              {URGENCY_CONFIG[u].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.urgency && <p className="text-xs text-urgency-critical">{errors.urgency.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Attachments</Label>
                <FileDropzone files={files} onChange={setFiles} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Submit ticket
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <AIAssistPanel
              description={description}
              onApplyDepartment={(d) => setValue("department", d, { shouldValidate: true })}
              onApplyUrgency={(u) => setValue("urgency", u, { shouldValidate: true })}
              onApplyTitle={(t) => setValue("title", t, { shouldValidate: true })}
            />
          </div>
        </form>
      </div>
    </AppShell>
  );
}
