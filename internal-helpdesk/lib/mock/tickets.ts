import { Ticket, TicketHistoryEntry, Comment, DepartmentSlug, Urgency, TicketStatus } from "@/lib/types";
import { users } from "./users";

const employees = users.filter((u) => u.role === "EMPLOYEE");
const agentsByDept: Record<DepartmentSlug, string[]> = {
  IT: ["a_it1", "a_it2"],
  HR: ["a_hr1"],
  FINANCE: ["a_fin1"],
  ADMIN_DEPT: ["a_adm1"],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seededRandom(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const daysAgo = (n: number, hourJitter = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() - Math.floor(rand() * hourJitter));
  return d.toISOString();
};

const titleBank: Record<DepartmentSlug, string[]> = {
  IT: [
    "Laptop won't connect to office WiFi",
    "VPN keeps disconnecting every 10 minutes",
    "Need admin access to install design software",
    "Monitor showing flickering display",
    "Cannot access shared drive from home",
    "Outlook not syncing new emails",
    "Request for a second monitor",
    "Slack notifications not working on desktop",
    "New hire laptop setup request",
    "Password reset for internal portal",
    "Printer on 3rd floor not responding",
    "Zoom audio cutting out during calls",
    "Need software license for Figma",
    "Two-factor auth locked me out of email",
    "Battery draining unusually fast on work laptop",
  ],
  HR: [
    "Need maternity leave application reviewed",
    "Question about annual leave balance",
    "Health insurance enrollment for new dependent",
    "Request for employment verification letter",
    "Issue with payslip showing wrong department",
    "Asking about work-from-home policy update",
    "Need to update emergency contact details",
    "Parental leave extension request",
    "Background check pending for offer letter",
    "Conflict with team member needs HR mediation",
    "Onboarding documents not received",
    "Asking about sabbatical leave eligibility",
  ],
  FINANCE: [
    "My salary is incorrect this month",
    "Reimbursement for client dinner not processed",
    "Need invoice copy for vendor payment",
    "Travel advance not credited yet",
    "Incorrect tax deduction on payslip",
    "Expense report rejected without reason",
    "Need W-9 form for contractor payment",
    "Relocation allowance not disbursed",
    "Bonus amount doesn't match offer letter",
    "Need help understanding PF deduction",
    "Client invoice has wrong billing address",
  ],
  ADMIN_DEPT: [
    "Need new access card for office entry",
    "AC not working in the 4th floor conference room",
    "Request for additional desk and chair",
    "Parking pass renewal request",
    "Need to book the main conference room",
    "Office supplies running low — stationery request",
    "Water dispenser leaking near pantry",
    "Visitor badge request for client meeting",
    "Cafeteria card recharge not reflecting",
    "Request for ergonomic keyboard and mouse",
  ],
};

const descriptionBank: Record<string, string> = {
  "Laptop won't connect to office WiFi":
    "Since this morning my laptop shows 'connected, no internet' on the office WiFi. Phone connects fine on the same network. Restarted twice already.",
  "My salary is incorrect this month":
    "This month's payslip shows a deduction I don't recognize, about ₹4,200 less than usual. Nothing changed on my end — no new loans or advances.",
  "I need maternity leave":
    "I'd like to start the process for maternity leave. My expected date is in 9 weeks and I want to understand the documentation and timeline.",
};

function genDescription(title: string): string {
  return (
    descriptionBank[title] ||
    `${title}. This has been affecting my work since earlier today and I'd appreciate help resolving it soon. Let me know if you need more details from my end.`
  );
}

const tagBank: Record<DepartmentSlug, string[]> = {
  IT: ["wifi", "vpn", "hardware", "access", "software", "email"],
  HR: ["leave", "benefits", "onboarding", "policy", "payroll"],
  FINANCE: ["payroll", "reimbursement", "invoice", "tax", "expense"],
  ADMIN_DEPT: ["facilities", "access-card", "supplies", "booking"],
};

function buildHistory(t: {
  id: string;
  createdById: string;
  assignedToId?: string;
  status: TicketStatus;
  createdAt: string;
  urgency: Urgency;
}): TicketHistoryEntry[] {
  const hist: TicketHistoryEntry[] = [
    {
      id: `${t.id}-h1`,
      ticketId: t.id,
      type: "CREATED",
      actorId: t.createdById,
      createdAt: t.createdAt,
      note: "Ticket submitted",
    },
  ];
  let cursor = new Date(t.createdAt);
  const advance = (mins: number) => {
    cursor = new Date(cursor.getTime() + mins * 60000);
    return cursor.toISOString();
  };

  if (t.assignedToId) {
    hist.push({
      id: `${t.id}-h2`,
      ticketId: t.id,
      type: "ASSIGNED",
      actorId: t.assignedToId,
      toValue: t.assignedToId,
      createdAt: advance(20 + Math.floor(rand() * 90)),
    });
  }
  if (t.status === "IN_PROGRESS" || t.status === "RESOLVED" || t.status === "CLOSED") {
    hist.push({
      id: `${t.id}-h3`,
      ticketId: t.id,
      type: "STATUS_CHANGE",
      actorId: t.assignedToId || t.createdById,
      fromValue: "OPEN",
      toValue: "IN_PROGRESS",
      createdAt: advance(15 + Math.floor(rand() * 120)),
    });
  }
  if (t.status === "RESOLVED" || t.status === "CLOSED") {
    hist.push({
      id: `${t.id}-h4`,
      ticketId: t.id,
      type: "STATUS_CHANGE",
      actorId: t.assignedToId || t.createdById,
      fromValue: "IN_PROGRESS",
      toValue: "RESOLVED",
      createdAt: advance(30 + Math.floor(rand() * 600)),
    });
  }
  if (t.status === "CLOSED") {
    hist.push({
      id: `${t.id}-h5`,
      ticketId: t.id,
      type: "STATUS_CHANGE",
      actorId: t.createdById,
      fromValue: "RESOLVED",
      toValue: "CLOSED",
      createdAt: advance(60 + Math.floor(rand() * 1440)),
    });
  }
  return hist;
}

let counter = 2001;
function nextId() {
  counter += 1;
  return `TKT-${counter}`;
}

function generateTicket(dept: DepartmentSlug, createdDaysAgo: number): Ticket {
  const id = nextId();
  const title = pick(titleBank[dept]);
  const employee = pick(employees);
  const urgency: Urgency = pick<Urgency>(["LOW", "LOW", "MEDIUM", "MEDIUM", "MEDIUM", "HIGH", "HIGH", "CRITICAL"]);
  const statusRoll = rand();
  let status: TicketStatus;
  if (createdDaysAgo < 1) status = pick<TicketStatus>(["OPEN", "OPEN", "IN_PROGRESS"]);
  else if (statusRoll < 0.18) status = "OPEN";
  else if (statusRoll < 0.4) status = "IN_PROGRESS";
  else if (statusRoll < 0.75) status = "RESOLVED";
  else status = "CLOSED";

  const assignedToId = status === "OPEN" ? undefined : pick(agentsByDept[dept]);
  const createdAt = daysAgo(createdDaysAgo, 18);
  const history = buildHistory({ id, createdById: employee.id, assignedToId, status, createdAt, urgency });
  const updatedAt = history[history.length - 1].createdAt;

  return {
    id,
    title,
    description: genDescription(title),
    department: dept,
    urgency,
    status,
    createdById: employee.id,
    assignedToId,
    createdAt,
    updatedAt,
    resolvedAt: status === "RESOLVED" || status === "CLOSED" ? history.find((h) => h.toValue === "RESOLVED")?.createdAt : undefined,
    closedAt: status === "CLOSED" ? history.find((h) => h.toValue === "CLOSED")?.createdAt : undefined,
    tags: Array.from(new Set([pick(tagBank[dept]), pick(tagBank[dept])])),
    attachments: [],
    comments: [],
    history,
    watchers: [],
  };
}

const generated: Ticket[] = [];
const depts: DepartmentSlug[] = ["IT", "HR", "FINANCE", "ADMIN_DEPT"];
for (let i = 0; i < 86; i++) {
  const dept = pick(depts);
  const createdDaysAgo = Math.floor(rand() * 45);
  generated.push(generateTicket(dept, createdDaysAgo));
}

// --- Hand-authored rich tickets for detail-view fidelity ---

const richTicket1: Ticket = {
  id: "TKT-2291",
  title: "Laptop not connecting to office WiFi",
  description:
    "Since this morning my laptop shows 'connected, no internet' on the office WiFi (Corp-5G). My phone connects fine on the same network. I've restarted the laptop twice and forgotten/rejoined the network once. This is blocking a client call at 2pm.",
  department: "IT",
  urgency: "HIGH",
  status: "IN_PROGRESS",
  createdById: "u_priya",
  assignedToId: "a_it1",
  createdAt: daysAgo(1, 4),
  updatedAt: daysAgo(0, 2),
  tags: ["wifi", "hardware"],
  attachments: [
    {
      id: "att_1",
      ticketId: "TKT-2291",
      fileName: "wifi-error-screenshot.png",
      fileSize: 184320,
      fileType: "image/png",
      uploadedById: "u_priya",
      uploadedAt: daysAgo(1, 4),
      url: "/mock/wifi-error-screenshot.png",
    },
  ],
  comments: [
    {
      id: "c1",
      ticketId: "TKT-2291",
      authorId: "a_it1",
      body: "Thanks for flagging this, Priya — taking a look now. Can you confirm if this started right after the laptop update last night?",
      createdAt: daysAgo(0, 20),
      mentions: [],
    },
    {
      id: "c2",
      ticketId: "TKT-2291",
      authorId: "u_priya",
      body: "Yes, it auto-updated overnight. Didn't have this issue before that.",
      createdAt: daysAgo(0, 18),
      mentions: [],
    },
    {
      id: "c3",
      ticketId: "TKT-2291",
      authorId: "a_it1",
      body: "That matches a known driver regression from the latest update. Forwarding a fix — will need you on a 5 min call to apply it.",
      createdAt: daysAgo(0, 6),
      mentions: [],
      isInternal: false,
    },
  ],
  history: [
    { id: "h1", ticketId: "TKT-2291", type: "CREATED", actorId: "u_priya", createdAt: daysAgo(1, 4), note: "Ticket submitted" },
    { id: "h2", ticketId: "TKT-2291", type: "ASSIGNED", actorId: "a_it1", toValue: "a_it1", createdAt: daysAgo(1, 3) },
    { id: "h3", ticketId: "TKT-2291", type: "STATUS_CHANGE", actorId: "a_it1", fromValue: "OPEN", toValue: "IN_PROGRESS", createdAt: daysAgo(0, 20) },
    { id: "h4", ticketId: "TKT-2291", type: "COMMENT_ADDED", actorId: "a_it1", createdAt: daysAgo(0, 20) },
    { id: "h5", ticketId: "TKT-2291", type: "COMMENT_ADDED", actorId: "u_priya", createdAt: daysAgo(0, 18) },
    { id: "h6", ticketId: "TKT-2291", type: "COMMENT_ADDED", actorId: "a_it1", createdAt: daysAgo(0, 6) },
  ],
  aiSuggestion: {
    id: "ai_1",
    ticketId: "TKT-2291",
    predictedDepartment: "IT",
    departmentConfidence: 0.97,
    suggestedUrgency: "HIGH",
    urgencyConfidence: 0.81,
    generatedTitle: "Laptop not connecting to office WiFi after update",
    duplicateOfTicketIds: [],
    troubleshootingSteps: [
      "Forget the Corp-5G network and rejoin with credentials",
      "Run 'ipconfig /release' then 'ipconfig /renew' (Windows) or toggle WiFi off/on (Mac)",
      "Check if a recent OS/driver update needs a network adapter reset",
      "Try connecting to Corp-2.4G as a fallback to isolate band-specific issues",
    ],
    suggestedFirstResponse:
      "Hi Priya, sorry about the disruption — this looks related to a driver regression from last night's update. I'll send a fix and we can apply it together in a quick call before your 2pm.",
    summary: "Employee's laptop lost internet connectivity on office WiFi after an overnight OS update; phone unaffected on same network.",
    tags: ["wifi", "driver-update", "connectivity"],
    createdAt: daysAgo(1, 4),
  },
  watchers: [],
};

const richTicket2: Ticket = {
  id: "TKT-2304",
  title: "Incorrect deduction on this month's payslip",
  description:
    "My payslip for this month shows a deduction of ₹4,200 labeled 'misc adjustment' that I don't recognize. I haven't taken any advances or loans recently. Could someone check what this is for?",
  department: "FINANCE",
  urgency: "MEDIUM",
  status: "OPEN",
  createdById: "u_arjun",
  createdAt: daysAgo(0, 6),
  updatedAt: daysAgo(0, 6),
  tags: ["payroll", "tax"],
  attachments: [],
  comments: [],
  history: [{ id: "h1", ticketId: "TKT-2304", type: "CREATED", actorId: "u_arjun", createdAt: daysAgo(0, 6), note: "Ticket submitted" }],
  aiSuggestion: {
    id: "ai_2",
    ticketId: "TKT-2304",
    predictedDepartment: "FINANCE",
    departmentConfidence: 0.95,
    suggestedUrgency: "MEDIUM",
    urgencyConfidence: 0.7,
    generatedTitle: "Unrecognized ₹4,200 deduction on payslip",
    duplicateOfTicketIds: ["TKT-2150"],
    troubleshootingSteps: [],
    suggestedFirstResponse:
      "Hi Arjun, thanks for flagging — I'll pull your payslip breakdown and check what the 'misc adjustment' line corresponds to, and get back to you within the day.",
    summary: "Employee disputes an unrecognized ₹4,200 deduction on the current payslip with no recent loans or advances taken.",
    tags: ["payroll-dispute", "deduction"],
    createdAt: daysAgo(0, 6),
  },
  watchers: [],
};

const richTicket3: Ticket = {
  id: "TKT-2150",
  title: "Payslip deduction discrepancy — March cycle",
  description: "Similar issue last cycle — an unexplained deduction appeared and was later traced to a benefits enrollment timing issue.",
  department: "FINANCE",
  urgency: "LOW",
  status: "CLOSED",
  createdById: "u_sam",
  assignedToId: "a_fin1",
  createdAt: daysAgo(60, 4),
  updatedAt: daysAgo(54, 2),
  resolvedAt: daysAgo(55, 2),
  closedAt: daysAgo(54, 2),
  tags: ["payroll", "benefits"],
  attachments: [],
  comments: [
    {
      id: "c1",
      ticketId: "TKT-2150",
      authorId: "a_fin1",
      body: "Traced this to a benefits enrollment that landed mid-cycle — corrected and reflected in the next payslip.",
      createdAt: daysAgo(55, 3),
      mentions: [],
    },
  ],
  history: [
    { id: "h1", ticketId: "TKT-2150", type: "CREATED", actorId: "u_sam", createdAt: daysAgo(60, 4), note: "Ticket submitted" },
    { id: "h2", ticketId: "TKT-2150", type: "STATUS_CHANGE", actorId: "a_fin1", fromValue: "OPEN", toValue: "RESOLVED", createdAt: daysAgo(55, 2) },
    { id: "h3", ticketId: "TKT-2150", type: "STATUS_CHANGE", actorId: "u_sam", fromValue: "RESOLVED", toValue: "CLOSED", createdAt: daysAgo(54, 2) },
  ],
  watchers: [],
};

const richTicket4: Ticket = {
  id: "TKT-2312",
  title: "Requesting maternity leave documentation and timeline",
  description:
    "I'd like to begin the process for maternity leave. My expected date is in about 9 weeks. Could someone walk me through the documentation needed and the typical timeline for approval?",
  department: "HR",
  urgency: "MEDIUM",
  status: "OPEN",
  createdById: "u_dev",
  createdAt: daysAgo(0, 3),
  updatedAt: daysAgo(0, 3),
  tags: ["leave", "benefits"],
  attachments: [],
  comments: [],
  history: [{ id: "h1", ticketId: "TKT-2312", type: "CREATED", actorId: "u_dev", createdAt: daysAgo(0, 3), note: "Ticket submitted" }],
  aiSuggestion: {
    id: "ai_3",
    ticketId: "TKT-2312",
    predictedDepartment: "HR",
    departmentConfidence: 0.99,
    suggestedUrgency: "MEDIUM",
    urgencyConfidence: 0.65,
    generatedTitle: "Maternity leave documentation & timeline request",
    duplicateOfTicketIds: [],
    troubleshootingSteps: [],
    suggestedFirstResponse:
      "Hi Devika, congratulations! I'll share our maternity leave policy doc and the checklist of forms — let's also set up a short call to walk through the timeline.",
    summary: "Employee requesting maternity leave process information ahead of an expected date roughly 9 weeks out.",
    tags: ["maternity-leave", "policy"],
    createdAt: daysAgo(0, 3),
  },
  watchers: [],
};

export const tickets: Ticket[] = [richTicket1, richTicket2, richTicket3, richTicket4, ...generated];

export const getTicketById = (id: string) => tickets.find((t) => t.id === id);
export const getTicketsByDepartment = (dept: DepartmentSlug) => tickets.filter((t) => t.department === dept);
export const getTicketsByEmployee = (userId: string) => tickets.filter((t) => t.createdById === userId);
export const getTicketsByAgent = (userId: string) => tickets.filter((t) => t.assignedToId === userId);
