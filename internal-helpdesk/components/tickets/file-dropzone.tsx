"use client";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileText, Image as ImageIcon, File as FileIcon } from "lucide-react";
import { formatFileSize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export interface PendingFile {
  file: File;
  id: string;
}

function iconFor(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type === "application/pdf" || type.includes("document")) return FileText;
  return FileIcon;
}

export function FileDropzone({ files, onChange }: { files: PendingFile[]; onChange: (files: PendingFile[]) => void }) {
  const onDrop = React.useCallback(
    (accepted: File[]) => {
      const next = accepted.map((file) => ({ file, id: `${file.name}-${file.size}-${Date.now()}` }));
      onChange([...files, ...next]);
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors cursor-pointer",
          isDragActive ? "border-accent bg-accent/5" : "border-border hover:border-border-strong"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-5 w-5 text-ink-faint" />
        <p className="text-xs text-ink-muted">
          <span className="text-accent font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-[11px] text-ink-faint">PNG, JPG, PDF up to 10MB</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f) => {
            const Icon = iconFor(f.file.type);
            return (
              <div key={f.id} className="flex items-center gap-2.5 rounded-md border border-border bg-canvas-subtle px-3 py-2">
                <Icon className="h-3.5 w-3.5 text-ink-faint shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink truncate">{f.file.name}</p>
                  <p className="text-[10px] text-ink-faint">{formatFileSize(f.file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(files.filter((x) => x.id !== f.id))}
                  className="text-ink-faint hover:text-urgency-critical transition-colors"
                  aria-label={`Remove ${f.file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
