import Link from "next/link";
import { getReportList } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";

export default async function StaffMapPage() { const data = await getReportList({}); return <div><h1 className="text-3xl font-bold">แผนที่ปัญหา</h1><p className="mt-2 text-muted-foreground">รายงานที่กำลังดำเนินงานในพื้นที่</p><Card className="mt-6"><CardHeader><CardTitle>รายงานล่าสุดในพื้นที่</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">เปิดรายงานเพื่อดูหมุดตำแหน่งและรายละเอียดบนแผนที่</p><div className="divide-y">{data.items.map((item) => <Link key={item.id} href={`/staff/reports/${item.id}`} className="flex items-center gap-3 py-3"><span className="min-w-0 flex-1"><span className="block truncate font-medium">{item.title}</span><span className="text-xs text-muted-foreground">{item.areaName || item.address}</span></span><ReportStatusBadge status={item.status} /></Link>)}</div></CardContent></Card></div>; }
