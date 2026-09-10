"use client";

import { useState, useTransition } from "react";
import { confirmResolutionAction } from "@/actions/reports";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";

export function ConfirmResolution({ reportId }: { reportId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  return <AlertDialog open={open} onOpenChange={setOpen}><AlertDialogTrigger render={<Button className="h-10" />}>ยืนยันว่าแก้ไขแล้ว</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>ยืนยันว่าปัญหานี้ได้รับการแก้ไขแล้วหรือไม่</AlertDialogTitle><AlertDialogDescription>เมื่อยืนยันแล้ว รายงานจะถูกปิด หากปัญหายังเกิดขึ้นอยู่คุณสามารถแสดงความคิดเห็นเพิ่มเติมได้</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>ยกเลิก</AlertDialogCancel><AlertDialogAction disabled={pending} onClick={() => startTransition(async () => { const result = await confirmResolutionAction(reportId); if (result.success) { toast.add({ title: "ปิดรายงานเรียบร้อยแล้ว", type: "success" }); setOpen(false); } else toast.add({ title: result.error, type: "error" }); })}>{pending ? "กำลังยืนยัน..." : "ยืนยัน"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
