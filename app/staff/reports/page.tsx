import Link from "next/link";
import { getActiveFormOptions, getReportList } from "@/lib/queries";
import { reportPriorities, reportStatuses, type ReportPriority, type ReportStatus } from "@/db/schema";
import { PRIORITY_LABELS } from "@/lib/constants";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportPagination } from "@/components/reports/pagination";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { formatThaiDate } from "@/lib/dates";

export default async function StaffReportsPage({ searchParams }: PageProps<"/staff/reports">) {
  const raw = await searchParams; const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, typeof value === "string" ? value : undefined]));
  const status = reportStatuses.includes(query.status as ReportStatus) ? query.status as ReportStatus : undefined; const priority = reportPriorities.includes(query.priority as ReportPriority) ? query.priority as ReportPriority : undefined;
  const [options, result] = await Promise.all([getActiveFormOptions(), getReportList({ page: Number(query.page) || 1, search: query.search, status, category: query.category, area: query.area, priority })]);
  return <div><h1 className="text-3xl font-bold">จัดการรายงาน</h1><p className="mt-2 text-muted-foreground">ตรวจสอบ จัดลำดับ และติดตามงานในพื้นที่</p><div className="mt-6"><ReportFilters {...options} staff defaults={query} /></div><div className="mt-5 overflow-x-auto rounded-2xl border bg-card"><div className="min-w-[920px]"><div className="grid grid-cols-[130px_1fr_140px_120px_110px_110px] gap-3 border-b bg-muted/50 px-4 py-3 text-xs font-semibold text-muted-foreground"><span>หมายเลข</span><span>ปัญหา</span><span>พื้นที่</span><span>ความสำคัญ</span><span>สถานะ</span><span>วันที่แจ้ง</span></div>{result.items.length ? <div className="divide-y">{result.items.map((report) => <Link key={report.id} href={`/staff/reports/${report.id}`} className="grid grid-cols-[130px_1fr_140px_120px_110px_110px] items-center gap-3 px-4 py-3 text-sm hover:bg-muted/30"><span className="font-mono text-xs font-semibold text-primary">{report.reportNumber}</span><span className="min-w-0"><span className="block truncate font-medium">{report.title}</span><span className="text-xs text-muted-foreground">{report.categoryName}</span></span><span className="truncate text-muted-foreground">{report.areaName || "ไม่ระบุ"}</span><span className={report.priority === "urgent" ? "font-semibold text-destructive" : ""}>{PRIORITY_LABELS[report.priority]}</span><ReportStatusBadge status={report.status} /><span className="text-xs text-muted-foreground">{formatThaiDate(report.createdAt)}</span></Link>)}</div> : <div className="py-16 text-center text-muted-foreground">ไม่พบรายงานที่ตรงกับการค้นหา</div>}</div></div><ReportPagination page={result.page} pageCount={result.pageCount} query={query} /></div>;
}
