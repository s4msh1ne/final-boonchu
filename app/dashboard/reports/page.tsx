import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { getActiveFormOptions, getReportList } from "@/lib/queries";
import { reportStatuses, type ReportStatus } from "@/db/schema";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportPagination } from "@/components/reports/pagination";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { formatThaiDate } from "@/lib/dates";

export default async function MyReportsPage({ searchParams }: PageProps<"/dashboard/reports">) {
  const currentUser = await requireUser();
  const raw = await searchParams;
  const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, typeof value === "string" ? value : undefined]));
  const status = reportStatuses.includes(query.status as ReportStatus) ? query.status as ReportStatus : undefined;
  const [options, result] = await Promise.all([getActiveFormOptions(), getReportList({ page: Number(query.page) || 1, search: query.search, status, category: query.category, area: query.area }, { reporterId: currentUser.id })]);
  return <div><h1 className="text-3xl font-bold tracking-tight">รายงานของฉัน</h1><p className="mt-2 text-muted-foreground">ติดตามทุกปัญหาที่คุณแจ้งไว้</p><div className="mt-6"><ReportFilters {...options} defaults={query} /></div><div className="mt-5 overflow-hidden rounded-2xl border bg-card"><div className="hidden grid-cols-[140px_1fr_160px_130px_120px] gap-4 border-b bg-muted/50 px-5 py-3 text-xs font-semibold text-muted-foreground md:grid"><span>หมายเลข</span><span>ปัญหา</span><span>ประเภท</span><span>วันที่แจ้ง</span><span>สถานะ</span></div>{result.items.length ? <div className="divide-y">{result.items.map((report) => <Link href={`/reports/${report.id}`} key={report.id} className="grid gap-2 p-4 transition hover:bg-muted/30 md:grid-cols-[140px_1fr_160px_130px_120px] md:items-center md:px-5"><span className="font-mono text-xs font-semibold text-primary">{report.reportNumber}</span><span className="font-medium">{report.title}</span><span className="text-sm text-muted-foreground">{report.categoryName}</span><span className="text-sm text-muted-foreground">{formatThaiDate(report.createdAt)}</span><ReportStatusBadge status={report.status} /></Link>)}</div> : <div className="py-16 text-center text-sm text-muted-foreground">ไม่พบรายงานที่ตรงกับการค้นหา</div>}</div><ReportPagination page={result.page} pageCount={result.pageCount} query={query} /></div>;
}
