"use client";

import { useActionState, useEffect, useRef } from "react";
import { addCommentAction } from "@/actions/reports";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

export function CommentForm({ reportId }: { reportId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(addCommentAction, null);
  useEffect(() => {
    if (state?.success) { formRef.current?.reset(); toast.add({ title: "ส่งความคิดเห็นแล้ว", type: "success" }); }
  }, [state]);
  return <form ref={formRef} action={action} className="mt-4 space-y-2"><input type="hidden" name="reportId" value={reportId} /><Textarea name="message" required minLength={2} maxLength={1000} placeholder="เขียนความคิดเห็นหรือแจ้งข้อมูลเพิ่มเติม..." className="min-h-24" />{state && !state.success && <p className="text-sm text-destructive">{state.error}</p>}<div className="flex justify-end"><Button type="submit" disabled={pending}>{pending ? "กำลังส่ง..." : "ส่งความคิดเห็น"}</Button></div></form>;
}
