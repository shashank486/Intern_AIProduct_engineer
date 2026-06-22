"use client";
import * as React from "react";
import { Sparkles, Loader2, FileText, ListChecks, MessageCircleReply, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/lib/types";
import { getUser } from "@/lib/mock";
import { toast } from "sonner";

type ToolKey = "summary" | "steps" | "firstResponse";

export function AITicketTools({ ticket, isAgentView }: { ticket: Ticket; isAgentView: boolean }) {
  const [loading, setLoading] = React.useState<ToolKey | null>(null);
  const [summary, setSummary] = React.useState<string | null>(ticket.aiSuggestion?.summary || null);
  const [steps, setSteps] = React.useState<string[] | null>(ticket.aiSuggestion?.troubleshootingSteps || null);
  const [firstResponse, setFirstResponse] = React.useState<string | null>(ticket.aiSuggestion?.suggestedFirstResponse || null);
  const [copied, setCopied] = React.useState(false);

  async function callAI<T>(key: ToolKey, url: string, body: object, onResult: (data: T) => void) {
    setLoading(key);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.code === "AI_NOT_CONFIGURED" ? "Add an OPENAI_API_KEY to enable AI tools" : "AI request failed");
        return;
      }
      const data = await res.json();
      onResult(data);
    } catch {
      toast.error("Couldn't reach the AI service");
    } finally {
      setLoading(null);
    }
  }

  function fullThreadText() {
    const commentText = ticket.comments.map((c) => `${getUser(c.authorId)?.name}: ${c.body}`).join("\n");
    return `Description: ${ticket.description}\n\nComments:\n${commentText}`;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2 text-ink-muted">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-ink">AI tools</span>
      </div>

      <ToolSection
        icon={FileText}
        label="Summarize thread"
        result={summary}
        renderResult={(s) => <p className="text-xs text-ink-muted leading-relaxed">{s}</p>}
        loading={loading === "summary"}
        onRun={() =>
          callAI<{ summary: string }>("summary", "/api/ai/summarize", { fullText: fullThreadText() }, (d) => setSummary(d.summary))
        }
      />

      {isAgentView && (
        <>
          <div className="h-px bg-border" />
          <ToolSection
            icon={ListChecks}
            label="Troubleshooting steps"
            result={steps}
            renderResult={(items) => (
              <ul className="space-y-1">
                {items.map((s, i) => (
                  <li key={i} className="text-xs text-ink-muted flex gap-1.5">
                    <span className="text-ink-faint">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ul>
            )}
            loading={loading === "steps"}
            onRun={() =>
              callAI<{ steps: string[] }>(
                "steps",
                "/api/ai/suggest-steps",
                { description: ticket.description, department: ticket.department },
                (d) => setSteps(d.steps)
              )
            }
          />

          <div className="h-px bg-border" />
          <ToolSection
            icon={MessageCircleReply}
            label="Draft first response"
            result={firstResponse}
            renderResult={(text) => (
              <div className="space-y-2">
                <p className="text-xs text-ink-muted leading-relaxed bg-canvas-subtle rounded-md p-2.5">{text}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy to comment"}
                </Button>
              </div>
            )}
            loading={loading === "firstResponse"}
            onRun={() =>
              callAI<{ response: string }>(
                "firstResponse",
                "/api/ai/first-response",
                { description: ticket.description, employeeName: getUser(ticket.createdById)?.name, department: ticket.department },
                (d) => setFirstResponse(d.response)
              )
            }
          />
        </>
      )}
    </div>
  );
}

function ToolSection<T>({
  icon: Icon,
  label,
  result,
  renderResult,
  loading,
  onRun,
}: {
  icon: React.ElementType;
  label: string;
  result: T | null;
  renderResult: (result: T) => React.ReactNode;
  loading: boolean;
  onRun: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <Button size="sm" variant="ghost" onClick={onRun} disabled={loading}>
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : result ? "Regenerate" : "Generate"}
        </Button>
      </div>
      {result && renderResult(result)}
    </div>
  );
}
