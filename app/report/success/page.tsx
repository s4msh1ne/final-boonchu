import Link from "next/link";
import { redirect } from "next/navigation";
import { IconCircleCheck } from "@tabler/icons-react";
import { requireUser } from "@/lib/permissions";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ReportSuccessPage({ searchParams }: PageProps<"/report/success">) {
  await requireUser();
  const query = await searchParams;
  const id = typeof query.id === "string" ? query.id : null;
  const number = typeof query.number === "string" ? query.number : null;
  if (!id || !number) redirect("/dashboard");
  return <><SiteHeader /><main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-xl place-items-center px-4 py-12"><Card className="w-full text-center"><CardContent className="py-8"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><IconCircleCheck className="size-9" /></span><h1 className="mt-5 text-2xl font-bold">แจ้งปัญหาสำเร็จ</h1><p className="mx-auto mt-2 max-w-md text-muted-foreground">เจ้าหน้าที่ได้รับรายงานของคุณแล้ว คุณสามารถติดตามสถานะการดำเนินงานได้จากหน้ารายงานของฉัน</p><div className="mx-auto mt-6 w-fit rounded-2xl bg-muted px-6 py-3"><p className="text-xs text-muted-foreground">หมายเลขรายงาน</p><p className="mt-1 font-mono text-lg font-bold text-primary">{number}</p></div><div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row"><Link href={`/reports/${id}`} className={buttonVariants({ className: "h-10" })}>ดูรายงาน</Link><Link href="/" className={buttonVariants({ variant: "outline", className: "h-10" })}>กลับหน้าหลัก</Link></div></CardContent></Card></main></>;
}
