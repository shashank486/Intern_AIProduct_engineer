// Seeds the database with the same shape of sample data used by lib/mock/*
// for the frontend prototype, so switching from mock data to Prisma queries
// produces a consistent experience. Run with: npm run db:seed

import { PrismaClient, Role, DepartmentSlug, Urgency, TicketStatus, HistoryType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding departments...");
  const departments = await Promise.all(
    [
      { slug: DepartmentSlug.IT, name: "IT", description: "Hardware, software, network, and account access", color: "210 85% 60%", icon: "Laptop" },
      { slug: DepartmentSlug.HR, name: "HR", description: "Leave, benefits, onboarding, and workplace concerns", color: "280 65% 65%", icon: "Users" },
      { slug: DepartmentSlug.FINANCE, name: "Finance", description: "Payroll, reimbursements, invoices, and expenses", color: "152 55% 45%", icon: "Wallet" },
      { slug: DepartmentSlug.ADMIN_DEPT, name: "Admin", description: "Facilities, supplies, travel, and office operations", color: "33 90% 56%", icon: "Building2" },
    ].map((d) => prisma.department.upsert({ where: { slug: d.slug }, update: d, create: d }))
  );

  const deptBySlug = Object.fromEntries(departments.map((d) => [d.slug, d]));

  console.log("Seeding users...");
  const employees = await Promise.all(
    [
      { name: "Priya Raman", email: "priya.raman@company.com", title: "Product Designer" },
      { name: "Arjun Mehta", email: "arjun.mehta@company.com", title: "Backend Engineer" },
      { name: "Lena Fischer", email: "lena.fischer@company.com", title: "Sales Associate" },
      { name: "Devika Nair", email: "devika.nair@company.com", title: "Marketing Lead" },
      { name: "Sam Okafor", email: "sam.okafor@company.com", title: "Data Analyst" },
    ].map((u) => prisma.user.upsert({ where: { email: u.email }, update: u, create: { ...u, role: Role.EMPLOYEE } }))
  );

  const agents = await Promise.all(
    [
      { name: "Rohan Iyer", email: "rohan.iyer@company.com", title: "IT Support Engineer", dept: DepartmentSlug.IT },
      { name: "Maya Chen", email: "maya.chen@company.com", title: "Systems Administrator", dept: DepartmentSlug.IT },
      { name: "Fatima Sheikh", email: "fatima.sheikh@company.com", title: "HR Generalist", dept: DepartmentSlug.HR },
      { name: "Carlos Mendes", email: "carlos.mendes@company.com", title: "Finance Associate", dept: DepartmentSlug.FINANCE },
      { name: "Grace Kim", email: "grace.kim@company.com", title: "Facilities Coordinator", dept: DepartmentSlug.ADMIN_DEPT },
    ].map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, title: u.title, departmentId: deptBySlug[u.dept].id },
        create: { name: u.name, email: u.email, title: u.title, role: Role.AGENT, departmentId: deptBySlug[u.dept].id },
      })
    )
  );

  await prisma.user.upsert({
    where: { email: "noah.williams@company.com" },
    update: {},
    create: { name: "Noah Williams", email: "noah.williams@company.com", title: "Head of Operations", role: Role.ADMIN },
  });

  console.log("Seeding a sample ticket with full history...");
  const priya = employees[0];
  const rohan = agents[0];

  const ticket = await prisma.ticket.upsert({
    where: { displayId: "TKT-2291" },
    update: {},
    create: {
      displayId: "TKT-2291",
      title: "Laptop not connecting to office WiFi",
      description:
        "Since this morning my laptop shows 'connected, no internet' on the office WiFi (Corp-5G). My phone connects fine on the same network.",
      departmentId: deptBySlug[DepartmentSlug.IT].id,
      urgency: Urgency.HIGH,
      status: TicketStatus.IN_PROGRESS,
      createdById: priya.id,
      assignedToId: rohan.id,
      tags: ["wifi", "hardware"],
      history: {
        create: [
          { type: HistoryType.CREATED, actorId: priya.id, note: "Ticket submitted" },
          { type: HistoryType.ASSIGNED, actorId: rohan.id, toValue: rohan.id },
          { type: HistoryType.STATUS_CHANGE, actorId: rohan.id, fromValue: "OPEN", toValue: "IN_PROGRESS" },
        ],
      },
      comments: {
        create: [
          { authorId: rohan.id, body: "Taking a look now — can you confirm if this started after last night's update?" },
          { authorId: priya.id, body: "Yes, it auto-updated overnight." },
        ],
      },
    },
  });

  console.log(`Seed complete. Sample ticket: ${ticket.displayId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
