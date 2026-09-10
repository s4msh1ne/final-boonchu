"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/permissions";

export async function markNotificationsReadAction() {
  const currentUser = await requireUser();
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, currentUser.id), isNull(notifications.readAt)));
  revalidatePath("/notifications");
}
