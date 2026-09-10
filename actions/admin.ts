"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { communityAreas, reportCategories, systemSettings, user } from "@/db/schema";
import { ACTION_ERROR, type ActionResult } from "@/lib/action-result";
import { requireAdmin } from "@/lib/permissions";
import { areaSchema, categorySchema, roleSchema, settingsSchema } from "@/lib/validations";

export async function saveCategoryAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "กรุณาตรวจสอบข้อมูลประเภทปัญหา" };
  try {
    const values = {
      name: parsed.data.name,
      icon: parsed.data.icon,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
    };
    if (parsed.data.id) {
      await db.update(reportCategories).set(values).where(eq(reportCategories.id, parsed.data.id));
    } else {
      await db.insert(reportCategories).values(values);
    }
    revalidatePath("/admin/categories");
    revalidatePath("/report/new");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("saveCategoryAction", error);
    return { success: false, error: ACTION_ERROR };
  }
}

export async function saveCategoryFormAction(formData: FormData) {
  await saveCategoryAction(null, formData);
}

export async function saveAreaAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = areaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "กรุณาตรวจสอบข้อมูลพื้นที่" };
  const values = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    isActive: parsed.data.isActive,
  };
  if (parsed.data.id) {
    await db.update(communityAreas).set(values).where(eq(communityAreas.id, parsed.data.id));
  } else {
    await db.insert(communityAreas).values(values);
  }
  revalidatePath("/admin/areas");
  revalidatePath("/report/new");
  return { success: true, data: undefined };
}

export async function saveAreaFormAction(formData: FormData) {
  await saveAreaAction(null, formData);
}

export async function changeUserRoleAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = roleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  if (parsed.data.userId === admin.id && parsed.data.role !== "admin") {
    const [{ value: adminCount }] = await db
      .select({ value: count() })
      .from(user)
      .where(eq(user.role, "admin"));
    if (adminCount <= 1) return;
  }
  await db.update(user).set({ role: parsed.data.role }).where(eq(user.id, parsed.data.userId));
  revalidatePath("/admin/users");
}

export async function saveSettingsAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "กรุณาตรวจสอบข้อมูลตั้งค่า" };
  await db
    .insert(systemSettings)
    .values({ id: "default", ...parsed.data })
    .onConflictDoUpdate({ target: systemSettings.id, set: parsed.data });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true, data: undefined };
}

export async function saveSettingsFormAction(formData: FormData) {
  await saveSettingsAction(null, formData);
}
