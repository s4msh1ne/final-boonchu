import { eq } from "drizzle-orm";
import { db } from "@/db";
import { systemSettings } from "@/db/schema";
import { saveSettingsFormAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() { const [settings] = await db.select().from(systemSettings).where(eq(systemSettings.id, "default")).limit(1); return <div><h1 className="text-3xl font-bold">ตั้งค่าระบบ</h1><p className="mt-2 text-muted-foreground">ข้อมูลติดต่อและชื่อพื้นที่ที่แสดงในระบบ</p><Card className="mt-6 max-w-2xl"><CardHeader><CardTitle>ข้อมูลชุมชน</CardTitle></CardHeader><CardContent><form action={saveSettingsFormAction} className="space-y-4"><label className="block text-sm">ชื่อชุมชน<input required name="communityName" defaultValue={settings?.communityName || "เทศบาลเมืองสุพรรณบุรี"} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label><label className="block text-sm">เบอร์โทรศัพท์ติดต่อ<input name="contactPhone" defaultValue={settings?.contactPhone || ""} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label><label className="block text-sm">อีเมลติดต่อ<input type="email" name="contactEmail" defaultValue={settings?.contactEmail || ""} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label><Button type="submit" className="h-10">บันทึกการตั้งค่า</Button></form></CardContent></Card></div>; }
