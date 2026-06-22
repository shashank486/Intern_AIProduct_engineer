"use client";
import * as React from "react";
import { toast } from "sonner";
import { Ticket, Comment } from "@/lib/types";
import { TicketStamp } from "@/components/tickets/ticket-stamp";
import { StatusBadge, UrgencyPill } from "@/components/tickets/badges";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/mock";
import { formatDateTime, formatFileSize } from "@/lib/utils/format";
import { DEPARTMENT_LABEL } from "@/lib/utils/ticket-style";
import { CommentThread, CommentComposer } from "@/components/comments/comment-thread";
import { HistoryTimeline } from "@/components/tickets/history-timeline";
import { AITicketTools } from "@/components/ai/ai-ticket-tools";
import { AgentControlPanel } from "@/components/tickets/agent-control-panel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Paperclip, Sparkles } from "lucide-react";
import { useSession } from "@/components/layout/session-provider";

export function TicketDetailView({ ticket: initialTicket }: { ticket: Ticket }) {
  const { user } = useSession();
  const isAgentOrAdmin = user.role === "AGENT" || user.role === "ADMIN";
  const [comments, setComments] = React.useState<Comment[]>(initialTicket.comments);
  const requester = getUser(initialTicket.createdById);

  function handleNewComment(body: string, isInternal: boolean) {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      ticketId: initialTicket.id,
      authorId: user.id,
      body,
      createdAt: new Date().toISOString(),
      mentions: [],
      isInternal,
    };
    setComments((prev) => [...prev, comment]);
    toast.success("Comment added");
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3 min-w-0">
          <TicketStamp id={initialTicket.id} urgency={initialTicket.urgency} />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-ink tracking-tight">{initialTicket.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StatusBadge status={initialTicket.status} />
              <UrgencyPill urgency={initialTicket.urgency} />
              <Badge variant="outline">{DEPARTMENT_LABEL[initialTicket.department]}</Badge>
              {initialTicket.tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5 min-w-0">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <Avatar name={requester?.name || "?"} size="sm" />
              <div>
                <p className="text-xs font-medium text-ink">{requester?.name}</p>
                <p className="text-[10px] text-ink-faint">Opened {formatDateTime(initialTicket.createdAt)}</p>
              </div>
            </div>
            <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{initialTicket.description}</p>

            {initialTicket.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {initialTicket.attachments.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 rounded-md border border-border bg-canvas-subtle px-2.5 py-1.5">
                    <Paperclip className="h-3 w-3 text-ink-faint" />
                    <span className="text-xs text-ink">{a.fileName}</span>
                    <span className="text-[10px] text-ink-faint">{formatFileSize(a.fileSize)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="comments" className="mt-4 space-y-4">
                <CommentThread comments={comments} />
                <div className="h-px bg-border" />
                <CommentComposer onSubmit={handleNewComment} allowInternal={isAgentOrAdmin} />
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <HistoryTimeline history={initialTicket.history} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-4">
          {isAgentOrAdmin && <AgentControlPanel ticket={initialTicket} />}
          <AITicketTools ticket={initialTicket} isAgentView={isAgentOrAdmin} />
        </div>
      </div>
    </div>
  );
}
