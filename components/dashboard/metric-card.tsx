import type { Icon } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ label, value, icon: IconComponent, hint }: { label: string; value: string | number; icon: Icon; hint?: string }) {
  return <Card size="sm"><CardContent className="flex items-center gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><IconComponent className="size-5" /></span><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-0.5 text-2xl font-bold tracking-tight">{value}</p>{hint && <p className="text-xs text-muted-foreground">{hint}</p>}</div></CardContent></Card>;
}
