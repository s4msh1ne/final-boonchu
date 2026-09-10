import Link from "next/link";
import { IconArrowRight, IconCamera, IconCheck, IconClipboardCheck, IconMapPin, IconProgress, IconReport, IconUsersGroup, type Icon } from "@tabler/icons-react";
import { getCommunitySettings, getDashboardMetrics, getReportList } from "@/lib/queries";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ReportCard } from "@/components/reports/report-card";
import { buttonVariants } from "@/components/ui/button";

export default async function HomePage() {
  const [metrics, recent, settings] = await Promise.all([
    getDashboardMetrics(),
    getReportList({}, { publicOnly: true }),
    getCommunitySettings(),
  ]);
  const handledPercent = metrics.total ? Math.round(((metrics.total - metrics.pending) / metrics.total) * 100) : 0;
  const stats: { label: string; value: string | number; icon: Icon }[] = [
    { label: "ปัญหาที่แจ้งทั้งหมด", value: metrics.total, icon: IconReport },
    { label: "กำลังดำเนินการ", value: metrics.inProgress, icon: IconProgress },
    { label: "แก้ไขแล้ว", value: metrics.resolved, icon: IconClipboardCheck },
    { label: "สมาชิกช่วยกัน", value: "ทุกคน", icon: IconUsersGroup },
  ];
  const steps: { number: string; title: string; description: string; icon: Icon }[] = [
    { number: "01", title: "แจ้งปัญหา", description: "ถ่ายรูปและระบุตำแหน่งของปัญหา", icon: IconCamera },
    { number: "02", title: "เจ้าหน้าที่รับเรื่อง", description: "หน่วยงานในพื้นที่ตรวจสอบและดำเนินการ", icon: IconClipboardCheck },
    { number: "03", title: "ติดตามผล", description: "ตรวจสอบความคืบหน้าได้ทุกขั้นตอน", icon: IconProgress },
  ];
  return <><SiteHeader /><main>
    <section className="relative overflow-hidden border-b bg-muted/40"><div className="absolute inset-y-0 right-0 hidden w-[45%] opacity-50 lg:block [background-image:linear-gradient(135deg,transparent_0_48%,var(--border)_48%_49%,transparent_49%_100%)] [background-size:72px_72px]" /><div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-28"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-medium text-primary"><span className="size-2 rounded-full bg-primary" />{settings.communityName}</div><h1 className="max-w-3xl font-heading text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-[3.5rem]">แจ้งปัญหาในชุมชนได้ง่าย<br /><span className="text-primary">ติดตามการแก้ไขได้ทุกขั้นตอน</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">ร่วมเป็นส่วนหนึ่งในการพัฒนาเมืองสุพรรณบุรี แจ้งปัญหาที่พบและติดตามการดำเนินงานจากหน่วยงานในพื้นที่ได้อย่างโปร่งใส</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/report/new" className={buttonVariants({ className: "h-12 px-6 text-base" })}>แจ้งปัญหา <IconArrowRight /></Link><Link href="/reports" className={buttonVariants({ variant: "outline", className: "h-12 bg-background px-6 text-base" })}>ดูปัญหาในชุมชน</Link></div></div><div className="relative hidden lg:block"><div className="mx-auto aspect-square max-w-[430px] rounded-[var(--radius-4xl)] border bg-card p-8 shadow-xl"><div className="grid h-full grid-cols-2 gap-4"><div className="col-span-2 flex items-end rounded-[var(--radius-3xl)] bg-primary p-6 text-primary-foreground"><div><IconMapPin className="mb-3 size-10" /><p className="text-2xl font-bold">เห็นปัญหา แจ้งได้ทันที</p><p className="mt-1 text-sm opacity-75">ถ่ายภาพ ระบุตำแหน่ง ส่งถึงเจ้าหน้าที่</p></div></div><div className="rounded-[var(--radius-3xl)] bg-accent p-5"><IconProgress className="size-8 text-primary" /><p className="mt-6 text-3xl font-bold">{handledPercent}%</p><p className="text-sm text-muted-foreground">ได้รับการดำเนินการ</p></div><div className="rounded-[var(--radius-3xl)] border bg-background p-5"><IconCheck className="size-8 text-primary" /><p className="mt-6 text-3xl font-bold">{metrics.resolved}</p><p className="text-sm text-muted-foreground">ปัญหาที่แก้ไขแล้ว</p></div></div></div></div></div></section>
    <section className="border-b bg-background"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y px-4 py-3 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">{stats.map(({ label, value, icon: IconComponent }) => <div key={label} className="flex items-center gap-3 px-3 py-5 sm:px-6"><IconComponent className="size-6 text-primary" /><div><p className="text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground sm:text-sm">{label}</p></div></div>)}</div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="flex items-end justify-between gap-5"><div><p className="text-sm font-semibold text-primary">สถานการณ์ล่าสุด</p><h2 className="mt-1 font-heading text-3xl font-bold tracking-tight">ปัญหาในชุมชน</h2><p className="mt-2 text-muted-foreground">ติดตามรายงานที่ชุมชนกำลังร่วมกันดูแล</p></div><Link href="/reports" className={buttonVariants({ variant: "ghost", className: "hidden sm:flex" })}>ดูทั้งหมด <IconArrowRight /></Link></div>{recent.items.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{recent.items.slice(0, 6).map((report) => <ReportCard key={report.id} {...report} />)}</div> : <div className="mt-8 rounded-3xl border border-dashed py-16 text-center text-muted-foreground">ยังไม่มีรายงานสาธารณะในขณะนี้</div>}</section>
    <section className="bg-[oklch(0.24_0.045_210)] text-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold text-teal-300">ง่าย โปร่งใส ติดตามได้</p><h2 className="mt-2 text-3xl font-bold">สามขั้นตอนเพื่อชุมชนที่ดีขึ้น</h2></div><div className="mt-10 grid gap-8 md:grid-cols-3">{steps.map(({ number, title, description, icon: IconComponent }) => <div key={number} className="relative rounded-3xl border border-white/10 bg-white/5 p-6"><span className="text-sm font-bold text-teal-300">{number}</span><IconComponent className="mt-8 size-8 text-teal-300" /><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 text-white/60">{description}</p></div>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="rounded-[var(--radius-4xl)] bg-primary/10 px-6 py-12 text-center sm:px-12"><h2 className="font-heading text-3xl font-bold">ชุมชนดีขึ้นได้ เมื่อทุกคนช่วยกัน</h2><p className="mx-auto mt-3 max-w-xl text-muted-foreground">ทุกการแจ้งปัญหาคือข้อมูลสำคัญที่ช่วยให้หน่วยงานในพื้นที่จัดลำดับและแก้ไขได้ตรงจุด</p><Link href="/report/new" className={buttonVariants({ className: "mt-7 h-11 px-6" })}>เริ่มแจ้งปัญหา</Link></div></section>
  </main><SiteFooter /></>;
}
