import type { Metadata } from "next";
import { requireUser } from "@/lib/permissions";
import { getActiveFormOptions } from "@/lib/queries";
import { ReportForm } from "@/components/reports/report-form";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = { title: "แจ้งปัญหา" };

export default async function NewReportPage() {
  await requireUser();
  const options = await getActiveFormOptions();
  return <><SiteHeader /><main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12"><p className="text-sm font-semibold text-primary">แจ้งให้ชุมชนทราบ</p><h1 className="mt-1 text-3xl font-bold tracking-tight">แจ้งปัญหาใหม่</h1><p className="mt-2 text-muted-foreground">ระบุข้อมูลให้ชัดเจน เพื่อช่วยให้เจ้าหน้าที่ตรวจสอบและแก้ไขได้รวดเร็ว</p><div className="mt-7"><ReportForm {...options} /></div></main></>;
}
