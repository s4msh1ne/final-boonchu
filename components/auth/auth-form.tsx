"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Fields = { name: string; email: string; phoneNumber: string; password: string };

export function AuthForm({ mode, callbackURL = "/dashboard" }: { mode: "login" | "register"; callbackURL?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Fields>();

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    const result = mode === "login"
      ? await authClient.signIn.email({ email: values.email, password: values.password, rememberMe: true })
      : await authClient.signUp.email({ name: values.name, email: values.email, password: values.password, phoneNumber: values.phoneNumber || undefined });
    if (result.error) {
      const message = mode === "login" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : "ไม่สามารถสร้างบัญชีได้ อีเมลนี้อาจถูกใช้งานแล้ว";
      setServerError(message);
      return;
    }
    toast.add({ title: mode === "login" ? "เข้าสู่ระบบสำเร็จ" : "สร้างบัญชีเรียบร้อยแล้ว", type: "success" });
    router.push(callbackURL.startsWith("/") ? callbackURL : "/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {mode === "register" && <div className="space-y-1.5"><Label htmlFor="name">ชื่อ-นามสกุล</Label><Input id="name" className="h-11" autoComplete="name" {...register("name", { required: "กรุณาระบุชื่อ", minLength: { value: 2, message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร" } })} aria-invalid={Boolean(errors.name)} />{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}</div>}
      <div className="space-y-1.5"><Label htmlFor="email">อีเมล</Label><Input id="email" type="email" className="h-11" autoComplete="email" {...register("email", { required: "กรุณาระบุอีเมล", pattern: { value: /^\S+@\S+\.\S+$/, message: "รูปแบบอีเมลไม่ถูกต้อง" } })} aria-invalid={Boolean(errors.email)} />{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}</div>
      {mode === "register" && <div className="space-y-1.5"><Label htmlFor="phoneNumber">เบอร์โทรศัพท์ <span className="font-normal text-muted-foreground">(ไม่บังคับ)</span></Label><Input id="phoneNumber" type="tel" className="h-11" autoComplete="tel" {...register("phoneNumber")} /></div>}
      <div className="space-y-1.5"><Label htmlFor="password">รหัสผ่าน</Label><Input id="password" type="password" className="h-11" autoComplete={mode === "login" ? "current-password" : "new-password"} {...register("password", { required: "กรุณาระบุรหัสผ่าน", minLength: { value: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" } })} aria-invalid={Boolean(errors.password)} />{errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}</div>
      {serverError && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{serverError}</p>}
      <Button type="submit" className="h-11 w-full text-base" disabled={isSubmitting}>{isSubmitting && <IconLoader2 className="animate-spin" />}{mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี"}</Button>
    </form>
  );
}
