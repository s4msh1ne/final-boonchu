import Link from "next/link";
import type { Icon } from "@tabler/icons-react";
import { SiteHeader } from "@/components/layout/site-header";

export function DashboardShell({ children, title, links }: { children: React.ReactNode; title: string; links: { label: string; href: string; icon: Icon }[] }) {
  return <div className="min-h-screen bg-muted/30"><SiteHeader /><div className="mx-auto grid max-w-7xl md:grid-cols-[220px_1fr]"><aside className="hidden min-h-[calc(100vh-4rem)] border-r bg-background p-4 md:block"><div className="mb-6 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div><nav className="grid gap-1">{links.map(({ label, href, icon: IconComponent }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"><IconComponent className="size-4" />{label}</Link>)}</nav></aside><main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main></div></div>;
}
