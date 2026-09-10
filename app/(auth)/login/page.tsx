import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const query = await searchParams;
  const callbackURL = typeof query.callbackURL === "string" ? query.callbackURL : "/dashboard";
  return <><p className="text-sm font-semibold text-primary">ยินดีต้อนรับกลับ</p><h1 className="mt-2 text-3xl font-bold tracking-tight">เข้าสู่ระบบ</h1><p className="mt-2 text-muted-foreground">ติดตามรายงานและความคืบหน้าของชุมชน</p><div className="mt-8"><AuthForm mode="login" callbackURL={callbackURL} /></div><p className="mt-6 text-center text-sm text-muted-foreground">ยังไม่มีบัญชี? <Link href="/register" className="font-semibold text-primary hover:underline">สมัครสมาชิก</Link></p></>;
}
