"use client";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Comment } from "@/lib/types";
import { getUser, users } from "@/lib/mock";
import { Avatar } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils/format";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, AtSign, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function CommentThread({ comments }: { comments: Comment[] }) {
  const sorted = [...comments].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  if (sorted.length === 0) {
    return <p className="text-xs text-ink-faint py-3">No comments yet — be the first to respond.</p>;
  }
  return (
    <div className="space-y-4">
      {sorted.map((c) => {
        const author = getUser(c.authorId);
        if (!author) return null;
        return (
          <div key={c.id} className="flex gap-3">
            <Avatar name={author.name} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-ink">{author.name}</span>
                <span className="text-[10px] text-ink-faint">{timeAgo(c.createdAt)}</span>
                {c.isInternal && (
                  <span className="flex items-center gap-1 text-[10px] text-urgency-medium bg-urgency-medium/10 px-1.5 py-0.5 rounded">
                    <Lock className="h-2.5 w-2.5" /> Internal
                  </span>
                )}
              </div>
              <div
                className={cn(
                  "prose-comment mt-1 rounded-md px-3 py-2",
                  c.isInternal ? "bg-urgency-medium/5 border border-urgency-medium/20" : "bg-canvas-subtle"
                )}
              >
                <ReactMarkdown>{c.body}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CommentComposer({
  onSubmit,
  allowInternal = false,
}: {
  onSubmit: (body: string, isInternal: boolean) => void;
  allowInternal?: boolean;
}) {
  const [body, setBody] = React.useState("");
  const [isInternal, setIsInternal] = React.useState(false);
  const [showMentions, setShowMentions] = React.useState(false);

  function handleSubmit() {
    if (body.trim().length === 0) return;
    onSubmit(body.trim(), isInternal);
    setBody("");
    setIsInternal(false);
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          setShowMentions(e.target.value.endsWith("@"));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
        placeholder="Write a comment... use @ to mention someone, supports markdown"
        rows={3}
      />
      {showMentions && (
        <div className="rounded-md border border-border bg-card p-1.5 max-h-32 overflow-y-auto">
          {users.slice(0, 5).map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => {
                setBody((b) => b + u.name.split(" ")[0] + " ");
                setShowMentions(false);
              }}
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-canvas-inset"
            >
              <AtSign className="h-3 w-3 text-ink-faint" />
              <span className="text-xs text-ink">{u.name}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        {allowInternal ? (
          <label className="flex items-center gap-1.5 text-xs text-ink-muted cursor-pointer">
            <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="accent-accent" />
            Internal note (not visible to employee)
          </label>
        ) : (
          <span />
        )}
        <Button size="sm" onClick={handleSubmit} disabled={body.trim().length === 0}>
          <Send className="h-3.5 w-3.5" />
          Comment
        </Button>
      </div>
    </div>
  );
}
