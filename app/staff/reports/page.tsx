import Link from "next/link";
import { IconInbox } from "@tabler/icons-react";
import { getActiveFormOptions, getReportList } from "@/lib/queries";
import {
  reportPriorities,
  reportStatuses,
  type ReportPriority,
  type ReportStatus,
} from "@/db/schema";
import { PRIORITY_LABELS } from "@/lib/constants";
import { formatThaiDate } from "@/lib/dates";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportPagination } from "@/components/reports/pagination";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function StaffReportsPage({
  searchParams,
}: PageProps<"/staff/reports">) {
  const raw = await searchParams;
  const query = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      typeof value === "string" ? value : undefined,
    ]),
  );
  const status = reportStatuses.includes(query.status as ReportStatus)
    ? query.status as ReportStatus
    : undefined;
  const priority = reportPriorities.includes(query.priority as ReportPriority)
    ? query.priority as ReportPriority
    : undefined;
  const [options, result] = await Promise.all([
    getActiveFormOptions(),
    getReportList({
      page: Number(query.page) || 1,
      search: query.search,
      status,
      category: query.category,
      area: query.area,
      priority,
    }),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold">จัดการรายงาน</h1>
      <p className="mt-2 text-muted-foreground">
        ตรวจสอบ รับเรื่อง มอบหมาย และบันทึกผลการดำเนินงาน
      </p>
      <div className="mt-6">
        <ReportFilters {...options} staff defaults={query} />
      </div>

      <div className="mt-5 rounded-2xl border bg-card">
        {result.items.length ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>หมายเลข</TableHead>
                <TableHead>ปัญหา</TableHead>
                <TableHead>พื้นที่</TableHead>
                <TableHead>ความสำคัญ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่แจ้ง</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.items.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {report.reportNumber}
                  </TableCell>
                  <TableCell className="max-w-72 whitespace-normal">
                    <Link
                      href={`/staff/reports/${report.id}`}
                      className="font-medium hover:underline"
                    >
                      {report.title}
                    </Link>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {report.categoryName}
                    </span>
                  </TableCell>
                  <TableCell>{report.areaName || "ไม่ระบุ"}</TableCell>
                  <TableCell className={report.priority === "urgent" ? "font-semibold text-destructive" : ""}>
                    {PRIORITY_LABELS[report.priority]}
                  </TableCell>
                  <TableCell><ReportStatusBadge status={report.status} /></TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatThaiDate(report.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/staff/reports/${report.id}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      เปิดงาน
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><IconInbox /></EmptyMedia>
              <EmptyTitle>ไม่พบรายงาน</EmptyTitle>
              <EmptyDescription>ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
      <ReportPagination page={result.page} pageCount={result.pageCount} query={query} />
    </div>
  );
}
