import { Department, User } from "@/lib/types";

export const departments: Department[] = [
  {
    id: "dept_it",
    slug: "IT",
    name: "IT",
    description: "Hardware, software, network, and account access",
    color: "210 85% 60%",
    icon: "Laptop",
  },
  {
    id: "dept_hr",
    slug: "HR",
    name: "HR",
    description: "Leave, benefits, onboarding, and workplace concerns",
    color: "280 65% 65%",
    icon: "Users",
  },
  {
    id: "dept_finance",
    slug: "FINANCE",
    name: "Finance",
    description: "Payroll, reimbursements, invoices, and expenses",
    color: "152 55% 45%",
    icon: "Wallet",
  },
  {
    id: "dept_admin",
    slug: "ADMIN_DEPT",
    name: "Admin",
    description: "Facilities, supplies, travel, and office operations",
    color: "33 90% 56%",
    icon: "Building2",
  },
];

export const currentUserId = "u_priya";

export const users: User[] = [
  { id: "u_priya", name: "Priya Raman", email: "priya.raman@company.com", role: "EMPLOYEE", title: "Product Designer", avatarUrl: "" },
  { id: "u_arjun", name: "Arjun Mehta", email: "arjun.mehta@company.com", role: "EMPLOYEE", title: "Backend Engineer" },
  { id: "u_lena", name: "Lena Fischer", email: "lena.fischer@company.com", role: "EMPLOYEE", title: "Sales Associate" },
  { id: "u_dev", name: "Devika Nair", email: "devika.nair@company.com", role: "EMPLOYEE", title: "Marketing Lead" },
  { id: "u_sam", name: "Sam Okafor", email: "sam.okafor@company.com", role: "EMPLOYEE", title: "Data Analyst" },

  { id: "a_it1", name: "Rohan Iyer", email: "rohan.iyer@company.com", role: "AGENT", department: "IT", title: "IT Support Engineer" },
  { id: "a_it2", name: "Maya Chen", email: "maya.chen@company.com", role: "AGENT", department: "IT", title: "Systems Administrator" },
  { id: "a_hr1", name: "Fatima Sheikh", email: "fatima.sheikh@company.com", role: "AGENT", department: "HR", title: "HR Generalist" },
  { id: "a_fin1", name: "Carlos Mendes", email: "carlos.mendes@company.com", role: "AGENT", department: "FINANCE", title: "Finance Associate" },
  { id: "a_adm1", name: "Grace Kim", email: "grace.kim@company.com", role: "AGENT", department: "ADMIN_DEPT", title: "Facilities Coordinator" },

  { id: "admin_1", name: "Noah Williams", email: "noah.williams@company.com", role: "ADMIN", title: "Head of Operations" },
];

export const getUser = (id: string) => users.find((u) => u.id === id);
export const getDepartment = (slug: string) => departments.find((d) => d.slug === slug);
