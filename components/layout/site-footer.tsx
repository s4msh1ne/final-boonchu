import Link from "next/link";
import { Brand } from "@/components/layout/brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div><Brand /><p className="mt-3 text-sm text-muted-foreground">ร่วมแจ้ง ร่วมติดตาม ร่วมพัฒนาชุมชน</p></div>
        <nav className="flex gap-5 text-sm text-muted-foreground md:ml-auto"><Link href="/reports">ปัญหาในชุมชน</Link><Link href="/report/new">แจ้งปัญหา</Link><Link href="/login">สำหรับเจ้าหน้าที่</Link></nav>
      </div>
    </footer>
  );
}
