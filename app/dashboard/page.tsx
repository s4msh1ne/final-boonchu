import Link from "next/link";
import { IconClock, IconFileDescription, IconPlus, IconProgress, IconRosetteDiscountCheck } from "@tabler/icons-react";
import { requireUser } from "@/lib/permissions";
import { getDashboardMetrics, getReportList } from "@/lib/queries";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatThaiDate } from "@/lib/dates";

export default async function DashboardPage() {
  const currentUser = await requireUser();
  const [metrics, recent] = await Promise.all([getDashboardMetrics(currentUser.id), getReportList({}, { reporterId: currentUser.id })]);
  return <div><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-muted-foreground">สวัสดี {currentUser.name}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">ภาพรวมรายงานของฉัน</h1></div><Link href="/report/new" className={buttonVariants({ className: "h-10" })}><IconPlus /> แจ้งปัญหาใหม่</Link></div><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="รายงานทั้งหมด" value={metrics.total} icon={IconFileDescription} /><MetricCard label="รอตรวจสอบ" value={metrics.pending} icon={IconClock} /><MetricCard label="กำลังดำเนินการ" value={metrics.inProgress} icon={IconProgress} /><MetricCard label="แก้ไขแล้ว" value={metrics.resolved} icon={IconRosetteDiscountCheck} /></div><Card className="mt-6"><CardHeader className="flex-row items-center justify-between"><CardTitle>รายงานล่าสุดของฉัน</CardTitle><Link href="/dashboard/reports" className={buttonVariants({ variant: "ghost", size: "sm" })}>ดูทั้งหมด</Link></CardHeader><CardContent>{recent.items.length ? <div className="divide-y">{recent.items.slice(0, 6).map((report) => <Link href={`/reports/${report.id}`} key={report.id} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[140px_1fr_150px_120px] sm:items-center"><span className="font-mono text-xs font-semibold text-primary">{report.reportNumber}</span><span><span className="block font-medium">{report.title}</span><span className="text-xs text-muted-foreground">{report.categoryName}</span></span><span className="text-xs text-muted-foreground">{formatThaiDate(report.createdAt)}</span><ReportStatusBadge status={report.status} /></Link>)}</div> : <div className="py-12 text-center"><h2 className="font-semibold">ยังไม่มีรายงาน</h2><p className="mt-1 text-sm text-muted-foreground">เมื่อพบปัญหาในชุมชน คุณสามารถแจ้งให้เจ้าหน้าที่ทราบได้ที่นี่</p><Link href="/report/new" className={buttonVariants({ className: "mt-4" })}>แจ้งปัญหา</Link></div>}</CardContent></Card></div>;
}
