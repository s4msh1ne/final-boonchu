import { IconChartBar, IconClipboardList, IconMap2 } from "@tabler/icons-react";
import { requireStaff } from "@/lib/permissions";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function StaffLayout({ children }: { children: React.ReactNode }) { await requireStaff(); return <DashboardShell title="ศูนย์ปฏิบัติการ" links={[{ label: "ภาพรวม", href: "/staff", icon: IconChartBar }, { label: "จัดการรายงาน", href: "/staff/reports", icon: IconClipboardList }, { label: "แผนที่ปัญหา", href: "/staff/map", icon: IconMap2 }]}>{children}</DashboardShell>; }
