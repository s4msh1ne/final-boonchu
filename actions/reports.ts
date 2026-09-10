"use server";

import { and, count, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  notifications,
  reportComments,
  reportImages,
  reports,
  reportUpdates,
} from "@/db/schema";
import { requireUser } from "@/lib/permissions";
import { ACTION_ERROR, type ActionResult } from "@/lib/action-result";
import { commentSchema, reportSchema } from "@/lib/validations";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_REPORT_IMAGES,
} from "@/lib/constants";
import { deleteFile, uploadFile } from "@/lib/storage";

export async function createReportAction(
  formData: FormData,
): Promise<ActionResult<{ id: string; reportNumber: string }>> {
  const currentUser = await requireUser();
  const parsed = reportSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      success: false,
      error: "กรุณาตรวจสอบข้อมูลให้ครบถ้วน",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length > MAX_REPORT_IMAGES) {
    return { success: false, error: `อัปโหลดรูปภาพได้สูงสุด ${MAX_REPORT_IMAGES} รูป` };
  }
  if (files.some((file) => file.size > MAX_IMAGE_SIZE)) {
    return { success: false, error: "รูปภาพแต่ละไฟล์ต้องมีขนาดไม่เกิน 5 MB" };
  }
  if (files.some((file) => !ACCEPTED_IMAGE_TYPES.includes(file.type as typeof ACCEPTED_IMAGE_TYPES[number]))) {
    return { success: false, error: "รองรับเฉพาะไฟล์ JPG, PNG และ WEBP" };
  }

  const [{ value: recentCount }] = await db
    .select({ value: count() })
    .from(reports)
    .where(
      and(
        eq(reports.reporterId, currentUser.id),
        gte(reports.createdAt, new Date(Date.now() - 60_000)),
      ),
    );
  if (recentCount >= 3) {
    return { success: false, error: "คุณส่งรายงานถี่เกินไป กรุณารอสักครู่" };
  }

  const uploaded = [] as Awaited<ReturnType<typeof uploadFile>>[];
  try {
    for (const file of files) uploaded.push(await uploadFile(file));

    const [created] = await db
      .insert(reports)
      .values({
        title: parsed.data.title,
        description: parsed.data.description,
        categoryId: parsed.data.categoryId,
        reporterId: currentUser.id,
        residentUrgency: parsed.data.residentUrgency,
        areaId: parsed.data.areaId || null,
        address: parsed.data.address,
        landmark: parsed.data.landmark || null,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        isPublic: parsed.data.isPublic,
      })
      .returning({ id: reports.id, reportNumber: reports.reportNumber });

    if (uploaded.length) {
      await db.insert(reportImages).values(
        uploaded.map((file, order) => ({
          reportId: created.id,
          url: file.url,
          objectKey: file.objectKey,
          order,
        })),
      );
    }
    await db.insert(reportUpdates).values({
      reportId: created.id,
      authorId: currentUser.id,
      type: "system",
      message: "ส่งรายงานเข้าสู่ระบบแล้ว รอเจ้าหน้าที่ตรวจสอบ",
      newStatus: "pending",
      isPublic: true,
    });

    revalidatePath("/");
    revalidatePath("/reports");
    revalidatePath("/dashboard");
    return { success: true, data: created };
  } catch (error) {
    await Promise.all(uploaded.map((file) => deleteFile(file.objectKey)));
    console.error("createReportAction", error);
    return { success: false, error: ACTION_ERROR };
  }
}

export async function addCommentAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const currentUser = await requireUser();
  const parsed = commentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: "กรุณาระบุข้อความอย่างน้อย 2 ตัวอักษร" };
  }

  const [report] = await db
    .select({ reporterId: reports.reporterId, reportNumber: reports.reportNumber })
    .from(reports)
    .where(eq(reports.id, parsed.data.reportId))
    .limit(1);
  const isStaff = currentUser.role === "staff" || currentUser.role === "admin";
  if (!report || (!isStaff && report.reporterId !== currentUser.id)) {
    return { success: false, error: "คุณไม่มีสิทธิ์แสดงความคิดเห็นในรายงานนี้" };
  }

  await db.insert(reportComments).values({
    reportId: parsed.data.reportId,
    authorId: currentUser.id,
    message: parsed.data.message,
  });

  if (isStaff && report.reporterId !== currentUser.id) {
    await db.insert(notifications).values({
      userId: report.reporterId,
      type: "new_comment",
      title: "มีความคิดเห็นใหม่",
      message: `เจ้าหน้าที่ตอบกลับรายงาน ${report.reportNumber}`,
      metadata: { reportId: parsed.data.reportId },
    });
  }

  revalidatePath(`/reports/${parsed.data.reportId}`);
  revalidatePath(`/staff/reports/${parsed.data.reportId}`);
  return { success: true, data: undefined };
}

export async function confirmResolutionAction(reportId: string): Promise<ActionResult> {
  const currentUser = await requireUser();
  const [report] = await db
    .select({ reporterId: reports.reporterId, status: reports.status })
    .from(reports)
    .where(eq(reports.id, reportId))
    .limit(1);
  if (!report || report.reporterId !== currentUser.id || report.status !== "resolved") {
    return { success: false, error: "ไม่สามารถยืนยันการแก้ไขรายงานนี้ได้" };
  }

  await db.update(reports).set({ status: "closed", closedAt: new Date() }).where(eq(reports.id, reportId));
  await db.insert(reportUpdates).values({
    reportId,
    authorId: currentUser.id,
    type: "status_change",
    message: "ผู้แจ้งยืนยันว่าปัญหาได้รับการแก้ไขแล้ว",
    oldStatus: "resolved",
    newStatus: "closed",
    isPublic: true,
  });
  revalidatePath(`/reports/${reportId}`);
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}
