import { IconCategory, IconHomeCog, IconMapPin, IconSettings, IconUsers } from "@tabler/icons-react";
import { requireAdmin } from "@/lib/permissions";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) { await requireAdmin(); return <DashboardShell title="ผู้ดูแลระบบ" links={[{ label: "ภาพรวม", href: "/admin", icon: IconHomeCog }, { label: "ผู้ใช้งาน", href: "/admin/users", icon: IconUsers }, { label: "ประเภทปัญหา", href: "/admin/categories", icon: IconCategory }, { label: "พื้นที่ชุมชน", href: "/admin/areas", icon: IconMapPin }, { label: "ตั้งค่า", href: "/admin/settings", icon: IconSettings }]}>{children}</DashboardShell>; }
