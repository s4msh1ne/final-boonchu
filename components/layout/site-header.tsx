import Link from "next/link";
import { IconBell, IconCircleFilled } from "@tabler/icons-react";
import { getCurrentUser } from "@/lib/permissions";
import { getUserNotifications } from "@/lib/queries";
import { formatThaiRelative } from "@/lib/dates";
import { markNotificationsReadAction } from "@/actions/notifications";
import { Brand } from "@/components/layout/brand";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AccountMenu } from "@/components/layout/account-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function SiteHeader() {
  const currentUser = await getCurrentUser();
  const notificationData = currentUser ? await getUserNotifications(currentUser.id) : null;
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <MobileNav authenticated={Boolean(currentUser)} />
        <Brand />
        <nav className="ml-8 hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="text-muted-foreground transition hover:text-foreground">หน้าหลัก</Link>
          <Link href="/reports" className="text-muted-foreground transition hover:text-foreground">ปัญหาในชุมชน</Link>
          {currentUser && <Link href="/dashboard" className="text-muted-foreground transition hover:text-foreground">แดชบอร์ด</Link>}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <Link href="/report/new" className={buttonVariants({ className: "hidden h-10 px-4 sm:inline-flex" })}>แจ้งปัญหา</Link>
          {currentUser && notificationData ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative size-10" aria-label="การแจ้งเตือน" />}>
                <IconBell />
                {notificationData.unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {Math.min(notificationData.unread, 99)}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-semibold text-foreground">การแจ้งเตือน</span>
                    {notificationData.unread > 0 && <form action={markNotificationsReadAction}><Button type="submit" variant="link" size="xs">อ่านทั้งหมด</Button></form>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notificationData.items.length ? notificationData.items.map((item) => (
                    <DropdownMenuItem key={item.id} render={<Link href={item.metadata.reportId ? `/reports/${item.metadata.reportId}` : "/dashboard"} />} className="items-start px-3 py-2.5">
                      {!item.readAt && <IconCircleFilled className="mt-1 size-2 text-primary" />}
                      <span className="min-w-0"><span className="block font-medium">{item.title}</span><span className="line-clamp-2 text-xs text-muted-foreground">{item.message}</span><span className="mt-1 block text-[11px] text-muted-foreground">{formatThaiRelative(item.createdAt)}</span></span>
                    </DropdownMenuItem>
                  )) : <p className="px-4 py-8 text-center text-sm text-muted-foreground">ยังไม่มีการแจ้งเตือน</p>}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !currentUser ? (
            <Link href="/login" className={buttonVariants({ variant: "ghost", className: "h-10" })}>เข้าสู่ระบบ</Link>
          ) : null}
          {currentUser && <AccountMenu name={currentUser.name} email={currentUser.email} image={currentUser.image} role={currentUser.role} />}
        </div>
      </div>
    </header>
  );
}
