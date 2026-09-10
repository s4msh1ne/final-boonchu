import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { IconCategory, IconFileDescription, IconMapPin, IconUsers } from "@tabler/icons-react";
import { db } from "@/db";
import { communityAreas, reportCategories, reports, user } from "@/db/schema";
import { MetricCard } from "@/components/dashboard/metric-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() { const [[users], [categories], [areas], [reportCount]] = await Promise.all([db.select({ value: count() }).from(user), db.select({ value: count() }).from(reportCategories).where(eq(reportCategories.isActive, true)), db.select({ value: count() }).from(communityAreas).where(eq(communityAreas.isActive, true)), db.select({ value: count() }).from(reports)]); return <div><h1 className="text-3xl font-bold">จัดการระบบ</h1><p className="mt-2 text-muted-foreground">ดูแลผู้ใช้งาน ข้อมูลพื้นฐาน และการตั้งค่าชุมชน</p><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="ผู้ใช้งาน" value={users.value} icon={IconUsers} /><MetricCard label="ประเภทที่เปิดใช้" value={categories.value} icon={IconCategory} /><MetricCard label="พื้นที่ที่เปิดใช้" value={areas.value} icon={IconMapPin} /><MetricCard label="รายงานทั้งหมด" value={reportCount.value} icon={IconFileDescription} /></div><Card className="mt-6"><CardHeader><CardTitle>ทางลัดสำหรับผู้ดูแล</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["จัดการผู้ใช้งาน", "/admin/users"],["จัดการประเภทปัญหา", "/admin/categories"],["จัดการพื้นที่", "/admin/areas"],["ตั้งค่าระบบ", "/admin/settings"]].map(([label, href]) => <Link key={href} href={href} className={buttonVariants({ variant: "outline", className: "h-12" })}>{label}</Link>)}</CardContent></Card></div>; }
