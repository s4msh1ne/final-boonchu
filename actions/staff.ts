"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  notifications,
  reportAssignments,
  reports,
  reportUpdates,
} from "@/db/schema";
import { STATUS_LABELS } from "@/lib/constants";
import { requireStaff } from "@/lib/permissions";
import { ACTION_ERROR, type ActionResult } from "@/lib/action-result";
import { staffUpdateSchema } from "@/lib/validations";

export async function updateReportAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const currentUser = await requireStaff();
  const parsed = staffUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      success: false,
      error: "กรุณาตรวจสอบข้อมูลการดำเนินงาน",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const [existing] = await db
    .select()
    .from(reports)
    .where(eq(reports.id, parsed.data.reportId))
    .limit(1);
  if (!existing) return { success: false, error: "ไม่พบรายงาน" };

  const statusChanged = existing.status !== parsed.data.status;
  if (
    statusChanged &&
    ["in_progress", "resolved", "closed"].includes(parsed.data.status) &&
    !parsed.data.message
  ) {
    return {
      success: false,
      error: "กรุณาระบุผลการดำเนินงาน",
      fieldErrors: {
        message: ["กรุณาระบุความคืบหน้าหรือผลการดำเนินงานอย่างน้อย 5 ตัวอักษร"],
      },
    };
  }

  try {
    const assignedToId = parsed.data.assignedToId || null;
    const assignmentChanged = existing.assignedToId !== assignedToId;
    const now = new Date();
    await db
      .update(reports)
      .set({
        status: parsed.data.status,
        priority: parsed.data.priority,
        assignedToId,
        acknowledgedAt:
          parsed.data.status !== "pending" && !existing.acknowledgedAt ? now : existing.acknowledgedAt,
        resolvedAt:
          parsed.data.status === "resolved" ? existing.resolvedAt ?? now : existing.resolvedAt,
        closedAt: parsed.data.status === "closed" ? existing.closedAt ?? now : existing.closedAt,
      })
      .where(eq(reports.id, existing.id));

    if (statusChanged) {
      const message = parsed.data.status === "rejected"
        ? `ไม่รับเรื่อง: ${parsed.data.rejectionReason}`
        : parsed.data.message || `เปลี่ยนสถานะเป็น ${STATUS_LABELS[parsed.data.status]}`;
      await db.insert(reportUpdates).values({
        reportId: existing.id,
        authorId: currentUser.id,
        type: "status_change",
        message,
        oldStatus: existing.status,
        newStatus: parsed.data.status,
        isPublic: true,
      });
      await db.insert(notifications).values({
        userId: existing.reporterId,
        type: "status_change",
        title: `รายงาน${STATUS_LABELS[parsed.data.status]}`,
        message: `รายงาน ${existing.reportNumber} เปลี่ยนสถานะเป็น ${STATUS_LABELS[parsed.data.status]}`,
        metadata: { reportId: existing.id },
      });
    } else if (parsed.data.message) {
      await db.insert(reportUpdates).values({
        reportId: existing.id,
        authorId: currentUser.id,
        type: "comment",
        message: parsed.data.message,
        isPublic: true,
      });
    }

    if (assignmentChanged && assignedToId) {
      await db.insert(reportAssignments).values({
        reportId: existing.id,
        assignedToId,
        assignedById: currentUser.id,
      });
      await db.insert(reportUpdates).values({
        reportId: existing.id,
        authorId: currentUser.id,
        type: "assignment",
        message: "มอบหมายผู้รับผิดชอบรายงานแล้ว",
        isPublic: true,
      });
    }

    revalidatePath("/");
    revalidatePath("/reports");
    revalidatePath("/staff");
    revalidatePath("/staff/reports");
    revalidatePath(`/staff/reports/${existing.id}`);
    revalidatePath(`/reports/${existing.id}`);
    revalidatePath(`/dashboard/reports`);
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("updateReportAction", error);
    return { success: false, error: ACTION_ERROR };
  }
}
