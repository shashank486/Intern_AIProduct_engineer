# Internal Helpdesk

A modern internal employee ticketing system for IT, HR, Finance, and Admin support — built with Next.js, TypeScript, Tailwind, and an AI assistant that predicts department/urgency, drafts titles, finds duplicates, and helps agents respond faster.

This repository is currently a **frontend-complete prototype**: all three role dashboards (Employee, Agent, Admin) are fully built against an in-memory mock dataset, and the **AI features are real** — they call OpenAI through Next.js API routes. The Prisma schema, Docker setup, and seed script are included so you can swap the mock data layer for a real Postgres database when you're ready (see [Going from prototype to production](#going-from-prototype-to-production)).

## Quick start

```bash
npm install
cp .env.example .env.local
# add your OPENAI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). There's no login screen yet — a **"Preview as"** switcher at the bottom of the sidebar lets you jump between an Employee, Agent (per department), and Admin account to see all three dashboards using the same mock dataset.

## What's implemented

**Employee**
- Dashboard with ticket stats (total / open / in progress / resolved / closed)
- Create ticket form: title, description, department, urgency, drag-and-drop attachments
- AI Assist panel that analyzes the description live: predicts department + urgency with confidence scores, generates a title, auto-tags, and flags possible duplicate tickets
- Ticket detail view: description, attachments, markdown comments, full history timeline
- My tickets list with search, status/urgency filters, sort

**Agent** (queue scoped to their department)
- Kanban board (Open → In Progress → Resolved → Closed) and list view
- Assign to self, advance ticket status through the workflow
- Internal (employee-hidden) notes, @mentions in comments
- AI tools: summarize thread, suggest troubleshooting steps, draft first response
- Cross-department "All tickets" view with full filters
- Ticket detail uses the same `/tickets/[id]` route as the employee view — `TicketDetailView` reads the active role from session context and conditionally renders the assignment/status controls and agent-only AI tools, rather than maintaining two parallel detail pages

**Admin**
- Org-wide overview: total/open/resolved counts, average resolution time
- Daily (14-day) and monthly (6-month) trend charts, tickets by department, tickets by urgency
- Per-department performance breakdown
- All tickets table with CSV export
- Users directory

**Across the app**
- Dark/light theme (persisted), responsive layout, loading skeletons, empty states, 404 and error pages
- Keyboard shortcuts: `n` to create a ticket, `/` to focus search
- Notifications popover with unread indicator

## AI features — how they work

Nine AI capabilities from the spec are implemented as real OpenAI-backed API routes in `app/api/ai/*`:

| Feature | Route | Used in |
|---|---|---|
| Predict department | `/api/ai/predict-department` | New ticket form |
| Suggest urgency | `/api/ai/suggest-urgency` | New ticket form |
| Generate title | `/api/ai/generate-title` | New ticket form |
| Find similar/duplicate tickets | `/api/ai/find-duplicates` | New ticket form |
| Suggest troubleshooting steps | `/api/ai/suggest-steps` | Ticket detail (agent) |
| Generate first response | `/api/ai/first-response` | Ticket detail (agent) |
| Summarize ticket thread | `/api/ai/summarize` | Ticket detail (both) |
| Auto-tag keywords | `/api/ai/auto-tag` | New ticket form |
| Combined analysis | `/api/ai/analyze` | Runs department + urgency + title + tags together for the live "as you type" panel |

All AI logic lives in `lib/ai/service.ts`, which wraps the OpenAI Chat Completions API with `response_format: json_object` for structured, parseable output. If `OPENAI_API_KEY` isn't set, the routes return a `503` with `code: "AI_NOT_CONFIGURED"` and the UI shows a friendly "AI Assist isn't configured" message instead of crashing — the rest of the app works fine without a key.

Swap `OPENAI_MODEL` in `.env.local` to use a different model, or swap the implementation in `lib/ai/client.ts` for Gemini/another provider — the route handlers don't need to change.

## Folder structure

```
helpdesk/
├── app/
│   ├── (employee)/           # Employee dashboard, ticket list, ticket detail (shared, role-aware), new ticket
│   ├── (agent)/               # Agent queue (board + list), all-department view
│   ├── (admin)/admin/         # Overview, analytics, all tickets, users
│   ├── api/ai/                # AI route handlers (one per capability, see table above)
│   ├── settings/              # Theme + profile
│   ├── layout.tsx             # Root layout: fonts, theme/session/tooltip providers
│   ├── page.tsx               # Redirects to the right dashboard for the current role
│   ├── not-found.tsx          # 404 page
│   └── global-error.tsx       # Error boundary
├── components/
│   ├── ui/                    # Button, Input, Select, Dialog, Tabs, Avatar, Badge, Card, Skeleton...
│   ├── layout/                # Sidebar, Topbar, AppShell, ThemeProvider, SessionProvider, RoleSwitcher
│   ├── tickets/                # TicketStamp, badges, rows, board/cards, filters, history, dropzone
│   ├── comments/              # Comment thread + composer (markdown, @mentions, internal notes)
│   ├── dashboard/              # StatCard
│   ├── charts/                 # Trend / department / urgency charts (Recharts)
│   ├── notifications/          # Notifications popover
│   └── ai/                     # AIAssistPanel (new ticket), AITicketTools (detail page)
├── lib/
│   ├── types/                  # Domain types + Zod schemas — mirrors the Prisma schema 1:1
│   ├── mock/                   # In-memory dataset standing in for the database for now
│   ├── ai/                     # OpenAI client + service functions called by the API routes
│   ├── hooks/                   # useDebouncedValue, useKeyboardShortcuts
│   └── utils/                   # cn, formatters, stats calculations, CSV export, style config
├── prisma/
│   ├── schema.prisma            # Full relational schema: User, Department, Ticket, Comment,
│   │                             # Attachment, TicketHistory, AISuggestion, Notification, TicketWatcher
│   └── seed.ts                  # Seeds sample data matching lib/mock/*
├── Dockerfile
├── docker-compose.yml            # App + Postgres
└── .env.example
```

## Database schema

The relational model lives in `prisma/schema.prisma` and mirrors `lib/types/index.ts` exactly, so the mock data and real data are structurally interchangeable:

- **Department** — IT / HR / Finance / Admin, each with its own agents and tickets
- **User** — role (`EMPLOYEE` / `AGENT` / `ADMIN`), optional department (required for agents)
- **Ticket** — title, description, department, urgency, status, requester, assignee, tags, timestamps (created/updated/resolved/closed/due)
- **Comment** — markdown body, internal-note flag, mentions, optional attachments
- **Attachment** — file metadata, linked to a ticket and optionally a comment
- **TicketHistory** — append-only audit trail (created, assigned, status change, comment, priority change, edited, reopened) with timestamps
- **AISuggestion** — one per ticket: predicted department/urgency with confidence, generated title, duplicate candidate IDs, troubleshooting steps, suggested first response, summary, tags
- **Notification** — per-user, typed (assigned/status changed/comment/resolved/mentioned), read flag
- **TicketWatcher** — join table for users following a ticket they don't own

## Going from prototype to production

The prototype intentionally keeps data access behind small functions in `lib/mock/*` (`getTicketById`, `getTicketsByDepartment`, etc.) so wiring up the real backend is mostly a matter of swapping implementations rather than rewriting pages:

1. **Provision Postgres** — `docker compose up db` or use a managed instance, set `DATABASE_URL`.
2. **Push the schema and seed it** — `npm run db:push && npm run db:seed`.
3. **Replace mock reads with Prisma queries.** Create `app/api/tickets/route.ts` (and `[id]/route.ts`, etc.) that call `prisma.ticket.findMany(...)` with the same shape currently returned by `lib/mock/tickets.ts`, and fetch from those routes (or use Server Components directly) instead of importing from `lib/mock`.
4. **Wire real auth.** Add Clerk (`@clerk/nextjs` is already a dependency) — replace `SessionProvider`/`useSession` in `components/layout/session-provider.tsx` with Clerk's `useUser()`/`auth()`, and gate routes with `middleware.ts`.
5. **Add realtime.** Stand up a small Socket.IO server (or a Next.js custom server) that emits `ticket:created`, `ticket:updated`, and `comment:added` events; subscribe to them in `AppShell` to replace the current static notifications list with live ones.
6. **Real email notifications.** Swap the mock notification messages for an email provider (Resend, SES, etc.) triggered from the same backend events as in-app notifications.
7. **File storage.** Point the attachment dropzone's upload handler at S3/R2/Vercel Blob instead of holding files in memory.

## Environment variables

See `.env.example`. At minimum, set `OPENAI_API_KEY` to use the AI features. Everything else (`DATABASE_URL`, Clerk keys, Socket.IO URL) is only needed once you wire up the corresponding backend piece above — the prototype runs without them.

## Docker

```bash
docker compose up --build
```

This starts Postgres and the app together. Set `OPENAI_API_KEY` in your shell or a `.env` file in the project root before running — `docker-compose.yml` passes it through.

## Deployment

**Vercel (recommended for the frontend/AI routes as they stand today):**
1. Push this repo to GitHub.
2. Import it in Vercel, set `OPENAI_API_KEY` in the project's environment variables.
3. Deploy — no database is required until you complete the steps in [Going from prototype to production](#going-from-prototype-to-production).

**Self-hosted / Docker:** use `docker-compose.yml` as a starting point; point `DATABASE_URL` at a managed Postgres instance (Neon, RDS, Supabase) for anything beyond local development.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Radix UI primitives · Framer Motion · React Hook Form + Zod · Recharts · React Dropzone · React Markdown · OpenAI API · Prisma + PostgreSQL (schema ready, not yet wired) · Clerk (dependency included, not yet wired) · Socket.IO (dependency included, not yet wired)
