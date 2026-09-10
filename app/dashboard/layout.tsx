import { IconBell, IconFileDescription, IconHome, IconPlus, IconUser } from "@tabler/icons-react";
import { requireUser } from "@/lib/permissions";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function ResidentLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <DashboardShell title="พื้นที่ของฉัน" links={[{ label: "ภาพรวม", href: "/dashboard", icon: IconHome }, { label: "รายงานของฉัน", href: "/dashboard/reports", icon: IconFileDescription }, { label: "แจ้งปัญหาใหม่", href: "/report/new", icon: IconPlus }, { label: "การแจ้งเตือน", href: "/dashboard/notifications", icon: IconBell }, { label: "บัญชีของฉัน", href: "/dashboard/profile", icon: IconUser }]}>{children}</DashboardShell>;
}
