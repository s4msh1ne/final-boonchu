import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IconCalendar, IconClock, IconMapPin, IconUser } from "@tabler/icons-react";
import { getReportDetail } from "@/lib/queries";
import { getCurrentUser } from "@/lib/permissions";
import { formatThaiDateTime } from "@/lib/dates";
import { PRIORITY_LABELS, STATUS_FLOW, STATUS_LABELS } from "@/lib/constants";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { ReportMap } from "@/components/reports/report-map";
import { CommentForm } from "@/components/reports/comment-form";
import { ConfirmResolution } from "@/components/reports/confirm-resolution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({ params }: PageProps<"/reports/[id]">): Promise<Metadata> {
  const { id } = await params;
  const report = await getReportDetail(id);
  return report?.isPublic ? { title: report.title, description: report.description.slice(0, 155) } : { title: "รายละเอียดรายงาน" };
}

export default async function ReportDetailPage({ params }: PageProps<"/reports/[id]">) {
  const { id } = await params;
  const [report, currentUser] = await Promise.all([getReportDetail(id), getCurrentUser()]);
  if (!report) notFound();
  const canManage = currentUser?.role === "staff" || currentUser?.role === "admin";
  const isOwner = currentUser?.id === report.reporterId;
  if (!report.isPublic && !isOwner && !canManage) notFound();
  const currentStep = STATUS_FLOW.indexOf(report.status);
  return <><SiteHeader /><main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-mono text-sm font-semibold text-primary">{report.reportNumber}</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{report.title}</h1><p className="mt-2 text-sm text-muted-foreground">{report.category.name}</p></div><div className="flex items-center gap-2"><ReportStatusBadge status={report.status} />{isOwner && report.status === "resolved" && <ConfirmResolution reportId={report.id} />}</div></div>
    {currentStep >= 0 && <div className="mb-6 overflow-x-auto rounded-2xl border bg-card p-4"><div className="flex min-w-[580px] items-center">{STATUS_FLOW.map((status, index) => <div key={status} className="flex flex-1 items-center last:flex-none"><div className="flex flex-col items-center gap-1.5"><span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index + 1}</span><span className={`text-xs ${index <= currentStep ? "font-medium" : "text-muted-foreground"}`}>{STATUS_LABELS[status]}</span></div>{index < STATUS_FLOW.length - 1 && <span className={`mx-2 mb-5 h-0.5 flex-1 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />}</div>)}</div></div>}
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]"><div className="space-y-6"><Card><CardHeader><CardTitle>รายละเอียดปัญหา</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap leading-7 text-muted-foreground">{report.description}</p></CardContent></Card>{report.images.length > 0 && <Card><CardHeader><CardTitle>รูปภาพ ({report.images.length})</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">{report.images.map((image, index) => <div key={image.id} className="relative aspect-square overflow-hidden rounded-2xl bg-muted"><Image src={image.url} alt={`ภาพปัญหา ${index + 1}`} fill className="object-cover" /></div>)}</CardContent></Card>}{report.latitude != null && report.longitude != null && <Card><CardHeader><CardTitle>ตำแหน่ง</CardTitle></CardHeader><CardContent><ReportMap latitude={report.latitude} longitude={report.longitude} interactive={false} /><p className="mt-3 flex gap-2 text-sm"><IconMapPin className="size-4 shrink-0 text-primary" />{report.address}</p>{report.landmark && <p className="ml-6 mt-1 text-sm text-muted-foreground">จุดสังเกต: {report.landmark}</p>}</CardContent></Card>}
      <Card><CardHeader><CardTitle>ความคืบหน้า</CardTitle></CardHeader><CardContent>{report.updates.filter((item) => item.isPublic).length ? <ol className="relative ml-3 border-l pl-6">{report.updates.filter((item) => item.isPublic).map((item) => <li key={item.id} className="relative pb-7 last:pb-0"><span className="absolute -left-[31px] top-1 size-3 rounded-full border-2 border-background bg-primary" /><p className="font-medium">{item.message}</p><p className="mt-1 text-xs text-muted-foreground">{item.author?.name || "ระบบ"} · {formatThaiDateTime(item.createdAt)}</p></li>)}</ol> : <p className="text-sm text-muted-foreground">ยังไม่มีการอัปเดต</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle>ความคิดเห็น</CardTitle></CardHeader><CardContent>{report.comments.length ? <div className="space-y-4">{report.comments.map((comment) => <div key={comment.id} className="rounded-2xl bg-muted/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">{comment.author.role === "staff" || comment.author.role === "admin" ? `เจ้าหน้าที่ · ${comment.author.name}` : "สมาชิกในชุมชน"}</p><p className="text-xs text-muted-foreground">{formatThaiDateTime(comment.createdAt)}</p></div><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{comment.message}</p></div>)}</div> : <p className="text-sm text-muted-foreground">ยังไม่มีความคิดเห็น</p>}{(isOwner || canManage) && <CommentForm reportId={report.id} />}</CardContent></Card></div>
      <aside className="space-y-4"><Card><CardHeader><CardTitle>ข้อมูลรายงาน</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><div className="flex justify-between gap-3"><span className="text-muted-foreground">สถานะ</span><ReportStatusBadge status={report.status} /></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">ความสำคัญ</span><span className="font-medium">{PRIORITY_LABELS[report.priority]}</span></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">ผู้รับผิดชอบ</span><span className="text-right font-medium">{report.assignee?.name || "ยังไม่ได้มอบหมาย"}</span></div><div className="flex justify-between gap-3"><span className="text-muted-foreground">พื้นที่</span><span className="text-right font-medium">{report.area?.name || "ไม่ระบุ"}</span></div></CardContent></Card><Card><CardContent className="space-y-3 text-sm"><p className="flex items-center gap-2"><IconUser className="size-4 text-muted-foreground" /><span className="text-muted-foreground">ผู้แจ้ง:</span> สมาชิกในชุมชน</p><p className="flex items-center gap-2"><IconCalendar className="size-4 text-muted-foreground" /><span>{formatThaiDateTime(report.createdAt)}</span></p><p className="flex items-center gap-2"><IconClock className="size-4 text-muted-foreground" /><span>อัปเดต {formatThaiDateTime(report.updatedAt)}</span></p></CardContent></Card></aside></div>
  </main><SiteFooter /></>;
}
