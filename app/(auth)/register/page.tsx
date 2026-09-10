import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "สมัครสมาชิก" };

export default function RegisterPage() {
  return <><p className="text-sm font-semibold text-primary">ร่วมเป็นส่วนหนึ่งของชุมชน</p><h1 className="mt-2 text-3xl font-bold tracking-tight">สร้างบัญชีใหม่</h1><p className="mt-2 text-muted-foreground">ใช้เวลาไม่ถึงหนึ่งนาทีในการเริ่มแจ้งปัญหา</p><div className="mt-8"><AuthForm mode="register" /></div><p className="mt-6 text-center text-sm text-muted-foreground">มีบัญชีแล้ว? <Link href="/login" className="font-semibold text-primary hover:underline">เข้าสู่ระบบ</Link></p></>;
}
