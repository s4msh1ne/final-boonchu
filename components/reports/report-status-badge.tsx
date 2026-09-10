import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/constants";
import type { ReportStatus } from "@/db/schema";
import { cn } from "@/lib/utils";

const styles: Record<ReportStatus, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  acknowledged: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  in_progress: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  closed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  rejected: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <Badge variant="secondary" className={cn("border-0", styles[status])}>{STATUS_LABELS[status]}</Badge>;
}
