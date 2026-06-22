"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-canvas text-center px-6">
          <div className="h-14 w-14 rounded-full bg-urgency-critical/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-urgency-critical" />
          </div>
          <h1 className="text-lg font-semibold text-ink">Something went wrong</h1>
          <p className="text-sm text-ink-faint mt-1.5 max-w-sm">
            An unexpected error occurred. Try again, and if it keeps happening, contact IT support.
          </p>
          <Button onClick={reset} className="mt-5">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
