import { getOpenAI, AI_MODEL } from "./client";
import { DepartmentSlug, Urgency, Ticket } from "@/lib/types";

// All functions degrade gracefully: if no API key is configured, callers should
// catch the thrown error and the API route will respond with a clear status
// so the frontend can show a "configure AI" state rather than crashing.

async function chatJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as T;
}

const DEPARTMENTS: DepartmentSlug[] = ["IT", "HR", "FINANCE", "ADMIN_DEPT"];
const URGENCIES: Urgency[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export interface DepartmentPrediction {
  department: DepartmentSlug;
  confidence: number;
  reasoning: string;
}

export async function predictDepartment(description: string): Promise<DepartmentPrediction> {
  return chatJSON<DepartmentPrediction>(
    `You triage internal employee support tickets into exactly one department: IT, HR, FINANCE, or ADMIN_DEPT.
IT = hardware, software, network, accounts, access.
HR = leave, benefits, onboarding, workplace conduct, policy.
FINANCE = payroll, reimbursements, invoices, taxes, expenses.
ADMIN_DEPT = facilities, office supplies, travel, building access, bookings.
Respond ONLY with JSON: {"department": "IT"|"HR"|"FINANCE"|"ADMIN_DEPT", "confidence": 0-1 float, "reasoning": "one short sentence"}.`,
    description
  );
}

export interface UrgencySuggestion {
  urgency: Urgency;
  confidence: number;
  reasoning: string;
}

export async function suggestUrgency(description: string): Promise<UrgencySuggestion> {
  return chatJSON<UrgencySuggestion>(
    `Classify the urgency of an internal support ticket as LOW, MEDIUM, HIGH, or CRITICAL.
CRITICAL = total work stoppage, security/safety risk, or affects many people right now.
HIGH = blocks the employee's work today.
MEDIUM = inconvenient but has a workaround or isn't time-critical.
LOW = minor, cosmetic, or no real deadline.
Respond ONLY with JSON: {"urgency": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", "confidence": 0-1 float, "reasoning": "one short sentence"}.`,
    description
  );
}

export async function generateTitle(description: string): Promise<{ title: string }> {
  return chatJSON<{ title: string }>(
    `Generate a short, specific, professional ticket title (under 70 characters) summarizing the issue described. No quotes, no trailing punctuation.
Respond ONLY with JSON: {"title": "..."}.`,
    description
  );
}

export interface DuplicateMatch {
  ticketId: string;
  similarity: number;
  reason: string;
}

export async function findSimilarTickets(
  description: string,
  candidates: Pick<Ticket, "id" | "title" | "description" | "department">[]
): Promise<{ matches: DuplicateMatch[] }> {
  if (candidates.length === 0) return { matches: [] };
  const candidateList = candidates
    .slice(0, 30)
    .map((c) => `${c.id} :: ${c.title} :: ${c.description.slice(0, 200)}`)
    .join("\n");
  return chatJSON<{ matches: DuplicateMatch[] }>(
    `You are given a NEW ticket description and a list of EXISTING tickets (id :: title :: description).
Identify up to 3 existing tickets that describe the same or a very similar underlying issue (possible duplicates).
Respond ONLY with JSON: {"matches": [{"ticketId": "...", "similarity": 0-1 float, "reason": "short phrase"}]}.
Only include matches with similarity >= 0.6. If none qualify, return an empty array.`,
    `NEW TICKET:\n${description}\n\nEXISTING TICKETS:\n${candidateList}`
  );
}

export async function suggestTroubleshootingSteps(description: string, department: DepartmentSlug): Promise<{ steps: string[] }> {
  return chatJSON<{ steps: string[] }>(
    `Given an internal ${department} support ticket, suggest 3-5 concrete self-service troubleshooting steps the employee or agent could try before deeper investigation. Keep each step under 15 words, actionable, ordered easiest-first.
Respond ONLY with JSON: {"steps": ["...", "..."]}.`,
    description
  );
}

export async function generateFirstResponse(
  description: string,
  employeeName: string,
  department: DepartmentSlug
): Promise<{ response: string }> {
  return chatJSON<{ response: string }>(
    `Write a brief, warm, professional first-response message (2-4 sentences) from a ${department} support agent to an employee named ${employeeName}, acknowledging their issue and stating the immediate next step. Do not sign off with a name.
Respond ONLY with JSON: {"response": "..."}.`,
    description
  );
}

export async function summarizeTicket(fullText: string): Promise<{ summary: string }> {
  return chatJSON<{ summary: string }>(
    `Summarize the following ticket thread (description plus comments) into 2-3 concise sentences capturing the issue, what's been tried, and current state. Be specific, no fluff.
Respond ONLY with JSON: {"summary": "..."}.`,
    fullText
  );
}

export async function autoTagTicket(description: string): Promise<{ tags: string[] }> {
  return chatJSON<{ tags: string[] }>(
    `Extract 2-5 short lowercase-hyphenated keyword tags (like "wifi", "payroll-dispute", "access-card") that categorize this ticket for search and filtering.
Respond ONLY with JSON: {"tags": ["...", "..."]}.`,
    description
  );
}

export async function analyzeTicket(description: string) {
  // Convenience: run the lightweight classification calls in parallel for the "new ticket" flow.
  const [dept, urgency, title, tags] = await Promise.all([
    predictDepartment(description),
    suggestUrgency(description),
    generateTitle(description),
    autoTagTicket(description),
  ]);
  return { department: dept, urgency, title, tags };
}

export { DEPARTMENTS, URGENCIES };
