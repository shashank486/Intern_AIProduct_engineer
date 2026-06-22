"use client";
import * as React from "react";
import { Sparkles, AlertTriangle, Loader2, CheckCircle2, ExternalLink, Settings2 } from "lucide-react";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { DepartmentSlug, Urgency } from "@/lib/types";
import { DEPARTMENT_LABEL, URGENCY_CONFIG } from "@/lib/utils/ticket-style";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnalysisResult {
  department: { department: DepartmentSlug; confidence: number; reasoning: string };
  urgency: { urgency: Urgency; confidence: number; reasoning: string };
  title: { title: string };
  tags: { tags: string[] };
}

interface DuplicateMatch {
  ticketId: string;
  similarity: number;
  reason: string;
}

export function AIAssistPanel({
  description,
  onApplyDepartment,
  onApplyUrgency,
  onApplyTitle,
}: {
  description: string;
  onApplyDepartment: (d: DepartmentSlug) => void;
  onApplyUrgency: (u: Urgency) => void;
  onApplyTitle: (t: string) => void;
}) {
  const debouncedDescription = useDebouncedValue(description, 700);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [duplicates, setDuplicates] = React.useState<DuplicateMatch[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [notConfigured, setNotConfigured] = React.useState(false);

  React.useEffect(() => {
    if (debouncedDescription.trim().length < 20) {
      setResult(null);
      setDuplicates([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function run() {
      try {
        const [analyzeRes, dupRes] = await Promise.all([
          fetch("/api/ai/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: debouncedDescription }),
          }),
          fetch("/api/ai/find-duplicates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: debouncedDescription }),
          }),
        ]);

        if (cancelled) return;

        if (!analyzeRes.ok) {
          const body = await analyzeRes.json();
          if (body.code === "AI_NOT_CONFIGURED") setNotConfigured(true);
          else setError(body.error || "Couldn't analyze this ticket.");
          setLoading(false);
          return;
        }

        const analyzeData = await analyzeRes.json();
        setResult(analyzeData);
        setNotConfigured(false);

        if (dupRes.ok) {
          const dupData = await dupRes.json();
          setDuplicates(dupData.matches || []);
        }
      } catch {
        if (!cancelled) setError("Couldn't reach the AI service.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedDescription]);

  if (description.trim().length < 20) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-ink-muted">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">AI Assist</span>
        </div>
        <p className="text-xs text-ink-faint mt-2">
          Start describing your issue — once you&apos;ve written a sentence or two, I&apos;ll suggest the department, urgency, and a clear title automatically.
        </p>
      </div>
    );
  }

  if (notConfigured) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-ink-muted mb-2">
          <Settings2 className="h-4 w-4 text-ink-faint" />
          <span className="text-sm font-medium">AI Assist isn&apos;t configured</span>
        </div>
        <p className="text-xs text-ink-faint">
          Add a <code className="ticket-stamp text-[11px] bg-canvas-inset px-1 py-0.5 rounded">GROQ_API_KEY</code> to your{" "}
          <code className="ticket-stamp text-[11px] bg-canvas-inset px-1 py-0.5 rounded">.env.local</code> file to enable department prediction, urgency suggestions, and duplicate detection. See the README for setup.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-ink-muted">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-ink">AI Assist</span>
        {loading && <Loader2 className="h-3 w-3 animate-spin text-ink-faint ml-auto" />}
      </div>

      {error && <p className="text-xs text-urgency-high">{error}</p>}

      {result && !loading && (
        <>
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-ink-faint uppercase tracking-wide">Predicted department</p>
                <p className="text-sm font-medium text-ink mt-0.5">{DEPARTMENT_LABEL[result.department.department]}</p>
                <p className="text-[11px] text-ink-faint mt-0.5">{result.department.reasoning}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onApplyDepartment(result.department.department)}>
                Apply
              </Button>
            </div>
            <ConfidenceBar value={result.department.confidence} />
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-ink-faint uppercase tracking-wide">Suggested urgency</p>
                <p className={`text-sm font-medium mt-0.5 ${URGENCY_CONFIG[result.urgency.urgency].text}`}>
                  {URGENCY_CONFIG[result.urgency.urgency].label}
                </p>
                <p className="text-[11px] text-ink-faint mt-0.5">{result.urgency.reasoning}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onApplyUrgency(result.urgency.urgency)}>
                Apply
              </Button>
            </div>
            <ConfidenceBar value={result.urgency.confidence} />
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-ink-faint uppercase tracking-wide">Suggested title</p>
              <p className="text-sm font-medium text-ink mt-0.5 truncate">{result.title.title}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => onApplyTitle(result.title.title)}>
              Use
            </Button>
          </div>

          {result.tags.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.tags.tags.map((tag) => (
                <span key={tag} className="text-[11px] rounded-md bg-canvas-inset text-ink-muted px-2 py-0.5">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {duplicates.length > 0 && (
        <div className="rounded-md border border-urgency-medium/30 bg-urgency-medium/5 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-urgency-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Possible duplicate found</span>
          </div>
          {duplicates.map((d) => (
            <Link
              key={d.ticketId}
              href={`/tickets/${d.ticketId}`}
              target="_blank"
              className="flex items-center justify-between gap-2 rounded-md bg-canvas px-2.5 py-1.5 hover:bg-canvas-subtle transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink ticket-stamp">{d.ticketId}</p>
                <p className="text-[11px] text-ink-faint truncate">{d.reason}</p>
              </div>
              <ExternalLink className="h-3 w-3 text-ink-faint shrink-0 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      )}

      {result && !loading && duplicates.length === 0 && (
        <div className="flex items-center gap-1.5 text-ink-faint">
          <CheckCircle2 className="h-3.5 w-3.5 text-signal-resolved" />
          <span className="text-[11px]">No similar tickets found</span>
        </div>
      )}
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 rounded-full bg-canvas-inset overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-ink-faint w-8 text-right">{pct}%</span>
    </div>
  );
}
