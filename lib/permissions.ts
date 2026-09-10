import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/db/schema";

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role as UserRole,
    phoneNumber: session.user.phoneNumber,
  };
}

export async function requireUser() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  return currentUser;
}

export async function requireStaff() {
  const currentUser = await requireUser();
  if (currentUser.role !== "staff" && currentUser.role !== "admin") {
    redirect("/dashboard");
  }
  return currentUser;
}

export async function requireAdmin() {
  const currentUser = await requireUser();
  if (currentUser.role !== "admin") redirect("/dashboard");
  return currentUser;
}
