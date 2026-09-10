"use client";

import { useActionState, useEffect } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { updateReportAction } from "@/actions/staff";
import type { ReportPriority, ReportStatus } from "@/db/schema";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

const statuses: ReportStatus[] = [
  "pending",
  "acknowledged",
  "in_progress",
  "resolved",
  "closed",
  "rejected",
];
const priorities: ReportPriority[] = ["low", "normal", "high", "urgent"];

type ReportOperationFormProps = {
  reportId: string;
  status: ReportStatus;
  priority: ReportPriority;
  assignedToId: string | null;
  staff: { id: string; name: string }[];
};

export function ReportOperationForm({
  reportId,
  status: initialStatus,
  priority,
  assignedToId,
  staff,
}: ReportOperationFormProps) {
  const [state, action, pending] = useActionState(updateReportAction, null);
  useEffect(() => {
    if (state?.success) {
      toast.add({ title: "อัปเดตการดำเนินงานเรียบร้อยแล้ว", type: "success" });
    }
  }, [state]);

  const messageErrors = state && !state.success
    ? state.fieldErrors?.message?.map((message) => ({ message }))
    : undefined;
  const rejectionErrors = state && !state.success
    ? state.fieldErrors?.rejectionReason?.map((message) => ({ message }))
    : undefined;

  return (
    <form action={action}>
      <input type="hidden" name="reportId" value={reportId} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="status">สถานะการดำเนินงาน</FieldLabel>
          <NativeSelect
            id="status"
            name="status"
            defaultValue={initialStatus}
            className="w-full"
          >
            {statuses.map((item) => (
              <NativeSelectOption key={item} value={item}>
                {STATUS_LABELS[item]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldDescription>
            สถานะนี้จะแสดงต่อผู้แจ้งและในหน้าสาธารณะทันที
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="priority">ระดับความสำคัญ</FieldLabel>
          <NativeSelect id="priority" name="priority" defaultValue={priority} className="w-full">
            {priorities.map((item) => (
              <NativeSelectOption key={item} value={item}>
                {PRIORITY_LABELS[item]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="assignedToId">ผู้รับผิดชอบ</FieldLabel>
          <NativeSelect id="assignedToId" name="assignedToId" defaultValue={assignedToId || "__unassigned"} className="w-full">
            <NativeSelectOption value="__unassigned">ยังไม่ได้มอบหมาย</NativeSelectOption>
            {staff.map((person) => (
              <NativeSelectOption key={person.id} value={person.id}>
                {person.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field data-invalid={Boolean(messageErrors?.length)}>
          <FieldLabel htmlFor="message">ความคืบหน้าสาธารณะ</FieldLabel>
          <Textarea
            id="message"
            name="message"
            maxLength={1000}
            aria-invalid={Boolean(messageErrors?.length)}
            placeholder="เช่น เจ้าหน้าที่ตรวจสอบพื้นที่และประสานฝ่ายสาธารณูปโภคแล้ว"
          />
          <FieldDescription>
            จำเป็นเมื่อเริ่มดำเนินการ แก้ไขแล้ว หรือปิดเรื่อง
          </FieldDescription>
          <FieldError errors={messageErrors} />
        </Field>

        <Field data-invalid={Boolean(rejectionErrors?.length)}>
            <FieldLabel htmlFor="rejectionReason">เหตุผลที่ไม่รับเรื่อง</FieldLabel>
            <Textarea
              id="rejectionReason"
              name="rejectionReason"
              maxLength={1000}
              aria-invalid={Boolean(rejectionErrors?.length)}
            />
            <FieldDescription>กรอกเมื่อเลือกสถานะไม่รับเรื่อง</FieldDescription>
            <FieldError errors={rejectionErrors} />
        </Field>

        {state && !state.success && (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>บันทึกไม่สำเร็จ</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Spinner />}
          {pending ? "กำลังบันทึก..." : "บันทึกการดำเนินงาน"}
        </Button>
      </FieldGroup>
    </form>
  );
}
