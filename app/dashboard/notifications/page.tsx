import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { getUserNotifications } from "@/lib/queries";
import { formatThaiDateTime } from "@/lib/dates";
import { markNotificationsReadAction } from "@/actions/notifications";
import { Button } from "@/components/ui/button";

export default async function NotificationsPage() { const currentUser = await requireUser(); const data = await getUserNotifications(currentUser.id, 50); return <div><div className="flex items-end justify-between"><div><h1 className="text-3xl font-bold">การแจ้งเตือน</h1><p className="mt-2 text-muted-foreground">ความเคลื่อนไหวล่าสุดจากรายงานของคุณ</p></div>{data.unread > 0 && <form action={markNotificationsReadAction}><Button type="submit" variant="outline">อ่านทั้งหมด</Button></form>}</div><div className="mt-6 overflow-hidden rounded-2xl border bg-card">{data.items.length ? <div className="divide-y">{data.items.map((item) => <Link key={item.id} href={item.metadata.reportId ? `/reports/${item.metadata.reportId}` : "/dashboard"} className={`block p-4 hover:bg-muted/40 ${!item.readAt ? "bg-primary/5" : ""}`}><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-muted-foreground">{item.message}</p></div><p className="shrink-0 text-xs text-muted-foreground">{formatThaiDateTime(item.createdAt)}</p></div></Link>)}</div> : <p className="py-16 text-center text-muted-foreground">ยังไม่มีการแจ้งเตือน</p>}</div></div>; }
