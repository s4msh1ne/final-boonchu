import Link from "next/link";
import { IconBellRinging } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <IconBellRinging className="size-5" stroke={1.8} />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight">สุพรรณแจ้งได้</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Suphan Alert</span>
        </span>
      )}
    </Link>
  );
}
