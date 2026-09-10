import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() { return <div><Skeleton className="h-10 w-64" /><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-3xl" />)}</div><Skeleton className="mt-6 h-80 rounded-3xl" /></div>; }
