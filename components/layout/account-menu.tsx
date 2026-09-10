"use client";

import { useRouter } from "next/navigation";
import { IconChevronDown, IconLayoutDashboard, IconLogout, IconUser } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserRole } from "@/db/schema";
import Link from "next/link";

export function AccountMenu({ name, email, image, role }: { name: string; email: string; image?: string | null; role: UserRole }) {
  const router = useRouter();
  const dashboardHref = role === "admin" ? "/admin" : role === "staff" ? "/staff" : "/dashboard";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-2 px-2" />}>
        <Avatar className="size-7">
          <AvatarImage src={image || undefined} alt={name} />
          <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate sm:block">{name}</span>
        <IconChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2">
            <span className="block truncate text-sm font-medium text-foreground">{name}</span>
            <span className="block truncate font-normal">{email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href={dashboardHref} />}>
            <IconLayoutDashboard /> แดชบอร์ด
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
            <IconUser /> บัญชีของฉัน
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { router.push("/login"); router.refresh(); } } })}
          >
            <IconLogout /> ออกจากระบบ
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
