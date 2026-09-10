import Image from "next/image";
import Link from "next/link";
import { IconMapPin, IconPhoto } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { formatThaiRelative } from "@/lib/dates";
import type { ReportStatus } from "@/db/schema";

type ReportCardProps = {
  id: string;
  title: string;
  categoryName: string;
  areaName: string | null;
  address: string;
  status: ReportStatus;
  createdAt: Date;
  thumbnail: string | null;
};

export function ReportCard(report: ReportCardProps) {
  return (
    <Card className="group h-full gap-0 py-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/reports/${report.id}`} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        {report.thumbnail ? <Image src={report.thumbnail} alt={`ภาพปัญหา ${report.title}`} fill className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-muted-foreground"><IconPhoto className="size-10 opacity-40" /></div>}
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">{report.categoryName}</span>
      </Link>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3"><Link href={`/reports/${report.id}`} className="line-clamp-2 text-base font-semibold leading-6 hover:text-primary">{report.title}</Link><ReportStatusBadge status={report.status} /></div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><IconMapPin className="size-4 shrink-0" /><span className="truncate">{report.areaName || report.address}</span><span className="ml-auto shrink-0">{formatThaiRelative(report.createdAt)}</span></div>
      </CardContent>
    </Card>
  );
}
