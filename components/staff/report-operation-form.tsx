"use client";

import { useActionState, useEffect } from "react";
import { updateReportAction } from "@/actions/staff";
import type { ReportPriority, ReportStatus } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

export function ReportOperationForm({ reportId, status, priority, assignedToId, staff }: { reportId: string; status: ReportStatus; priority: ReportPriority; assignedToId: string | null; staff: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(updateReportAction, null);
  useEffect(() => { if (state?.success) toast.add({ title: "อัปเดตรายงานเรียบร้อยแล้ว", type: "success" }); }, [state]);
  return <form action={action} className="space-y-4"><input type="hidden" name="reportId" value={reportId} /><div className="space-y-1.5"><Label htmlFor="status">สถานะ</Label><select id="status" name="status" defaultValue={status} className="h-10 w-full rounded-xl border bg-background px-3 text-sm"><option value="pending">รอตรวจสอบ</option><option value="acknowledged">รับเรื่องแล้ว</option><option value="in_progress">กำลังดำเนินการ</option><option value="resolved">แก้ไขแล้ว</option><option value="closed">ปิดเรื่อง</option><option value="rejected">ไม่รับเรื่อง</option></select></div><div className="space-y-1.5"><Label htmlFor="priority">ความสำคัญ</Label><select id="priority" name="priority" defaultValue={priority} className="h-10 w-full rounded-xl border bg-background px-3 text-sm"><option value="low">ต่ำ</option><option value="normal">ปกติ</option><option value="high">สูง</option><option value="urgent">เร่งด่วน</option></select></div><div className="space-y-1.5"><Label htmlFor="assignedToId">ผู้รับผิดชอบ</Label><select id="assignedToId" name="assignedToId" defaultValue={assignedToId || ""} className="h-10 w-full rounded-xl border bg-background px-3 text-sm"><option value="">ยังไม่ได้มอบหมาย</option>{staff.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></div><div className="space-y-1.5"><Label htmlFor="message">ความคืบหน้าสาธารณะ</Label><Textarea id="message" name="message" maxLength={1000} placeholder="เช่น ประสานงานกับฝ่ายสาธารณูปโภคแล้ว" /></div><div className="space-y-1.5"><Label htmlFor="rejectionReason">เหตุผลที่ปฏิเสธ <span className="font-normal text-muted-foreground">(จำเป็นเมื่อไม่รับเรื่อง)</span></Label><Textarea id="rejectionReason" name="rejectionReason" maxLength={1000} /></div>{state && !state.success && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>}<Button type="submit" className="h-10 w-full" disabled={pending}>{pending ? "กำลังบันทึก..." : "บันทึกการดำเนินงาน"}</Button></form>;
}
