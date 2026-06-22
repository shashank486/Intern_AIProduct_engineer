import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas text-center px-6">
      <div className="h-14 w-14 rounded-full bg-canvas-inset flex items-center justify-center mb-4">
        <FileQuestion className="h-6 w-6 text-ink-faint" />
      </div>
      <h1 className="text-lg font-semibold text-ink">Page not found</h1>
      <p className="text-sm text-ink-faint mt-1.5 max-w-sm">
        The ticket or page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button asChild className="mt-5">
        <Link href="/">Back to dashboard</Link>
      </Button>
    </div>
  );
}
