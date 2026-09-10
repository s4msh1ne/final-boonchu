"use client";

import Link from "next/link";
import { IconMenu2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Brand } from "@/components/layout/brand";

export function MobileNav({ authenticated }: { authenticated: boolean }) {
  const links = authenticated
    ? [["แดชบอร์ด", "/dashboard"], ["รายงานของฉัน", "/dashboard/reports"], ["แจ้งปัญหา", "/report/new"]]
    : [["หน้าหลัก", "/"], ["ปัญหาในชุมชน", "/reports"], ["แจ้งปัญหา", "/report/new"]];
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="เปิดเมนู" />}>
        <IconMenu2 />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-5">
        <SheetHeader className="text-left"><SheetTitle><Brand /></SheetTitle></SheetHeader>
        <nav className="mt-8 grid gap-1">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-xl px-3 py-3 text-base font-medium hover:bg-muted">{label}</Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
