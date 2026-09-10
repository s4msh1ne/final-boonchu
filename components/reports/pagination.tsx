import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button, buttonVariants } from "@/components/ui/button";

export function ReportPagination({ page, pageCount, query }: { page: number; pageCount: number; query: Record<string, string | undefined> }) {
  if (pageCount <= 1) return null;
  const href = (nextPage: number) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => { if (value) params.set(key, value); });
    params.set("page", String(nextPage));
    return `?${params}`;
  };
  return <div className="flex items-center justify-center gap-3 pt-8">{page > 1 ? <Link href={href(page - 1)} className={buttonVariants({ variant: "outline" })}><IconChevronLeft /> ก่อนหน้า</Link> : <Button variant="outline" disabled><IconChevronLeft /> ก่อนหน้า</Button>}<span className="text-sm text-muted-foreground">หน้า {page} จาก {pageCount}</span>{page < pageCount ? <Link href={href(page + 1)} className={buttonVariants({ variant: "outline" })}>ถัดไป <IconChevronRight /></Link> : <Button variant="outline" disabled>ถัดไป <IconChevronRight /></Button>}</div>;
}
