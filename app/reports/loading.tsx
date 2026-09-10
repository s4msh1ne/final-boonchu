import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() { return <main className="mx-auto w-full max-w-7xl px-4 py-10"><Skeleton className="h-10 w-64" /><Skeleton className="mt-6 h-16 w-full" /><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-3xl" />)}</div></main>; }
