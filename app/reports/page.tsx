import type { Metadata } from "next";
import { getActiveFormOptions, getReportList } from "@/lib/queries";
import { reportPriorities, reportStatuses, type ReportPriority, type ReportStatus } from "@/db/schema";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ReportCard } from "@/components/reports/report-card";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportPagination } from "@/components/reports/pagination";

export const metadata: Metadata = { title: "ปัญหาในชุมชน", description: "ติดตามปัญหาและความคืบหน้าในการแก้ไขภายในชุมชน" };

export default async function ReportsPage({ searchParams }: PageProps<"/reports">) {
  const raw = await searchParams;
  const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, typeof value === "string" ? value : undefined]));
  const status = reportStatuses.includes(query.status as ReportStatus) ? query.status as ReportStatus : undefined;
  const priority = reportPriorities.includes(query.priority as ReportPriority) ? query.priority as ReportPriority : undefined;
  const [options, result] = await Promise.all([getActiveFormOptions(), getReportList({ page: Number(query.page) || 1, search: query.search, status, category: query.category, area: query.area, priority, sort: query.sort === "oldest" || query.sort === "updated" ? query.sort : "latest" }, { publicOnly: true })]);
  return <><SiteHeader /><main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-semibold text-primary">ข้อมูลเปิดของชุมชน</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">ปัญหาในชุมชน</h1><p className="mt-3 text-muted-foreground">ค้นหาและติดตามการดำเนินงานของปัญหาที่ได้รับแจ้ง</p></div><div className="mt-7"><ReportFilters {...options} defaults={query} /></div><div className="mt-6 flex items-center justify-between"><p className="text-sm text-muted-foreground">พบ <strong className="text-foreground">{result.total}</strong> รายงาน</p></div>{result.items.length ? <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{result.items.map((report) => <ReportCard key={report.id} {...report} />)}</div> : <div className="mt-5 rounded-3xl border border-dashed py-20 text-center"><h2 className="font-semibold">ไม่พบรายงานที่ตรงกับการค้นหา</h2><p className="mt-1 text-sm text-muted-foreground">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p></div>}<ReportPagination page={result.page} pageCount={result.pageCount} query={query} /></main><SiteFooter /></>;
}
