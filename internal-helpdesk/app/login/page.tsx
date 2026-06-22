import Link from "next/link";
import { Ticket } from "lucide-react";

// Placeholder sign-in page. Once Clerk is wired up (see README → "Going from
// prototype to production"), replace this with Clerk's <SignIn /> component:
//
//   import { SignIn } from "@clerk/nextjs";
//   export default function LoginPage() {
//     return <SignIn />;
//   }
//
// For now, the app skips auth entirely and uses the "Preview as" switcher
// in the sidebar to demo all three roles against the mock dataset.

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <div className="h-11 w-11 rounded-lg bg-accent flex items-center justify-center mb-4">
        <Ticket className="h-5 w-5 text-accent-foreground" />
      </div>
      <h1 className="text-lg font-semibold text-ink">Sign-in not yet wired up</h1>
      <p className="text-sm text-ink-faint mt-1.5 max-w-sm">
        This prototype uses the "Preview as" switcher in the sidebar instead of real authentication.
        See the README for how to wire up Clerk here.
      </p>
      <Link href="/" className="text-sm text-accent hover:underline mt-5">
        Back to the app
      </Link>
    </div>
  );
}
