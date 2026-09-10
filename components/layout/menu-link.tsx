"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function MenuLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <DropdownMenuItem
      className={className}
      onClick={() => router.push(href)}
    >
      {children}
    </DropdownMenuItem>
  );
}
