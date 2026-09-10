"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { STATUS_LABELS } from "@/lib/constants";
import type { ReportStatus } from "@/db/schema";

const colors = ["#0f8b8d", "#4f6f9f", "#70a288", "#d6a84b", "#b45f62", "#8b7ca8"];

export function StaffCharts({ byStatus, byCategory, overTime }: { byStatus: { name: ReportStatus; value: number }[]; byCategory: { name: string; value: number }[]; overTime: { date: string; value: number }[] }) {
  const statuses = byStatus.map((item) => ({ ...item, label: STATUS_LABELS[item.name] }));
  return <div className="grid gap-5 xl:grid-cols-2"><div className="rounded-3xl border bg-card p-5"><h2 className="font-semibold">รายงานตามสถานะ</h2><ChartContainer config={{ value: { label: "จำนวน", color: "#0f8b8d" } }} className="mt-4 h-64 w-full"><PieChart><ChartTooltip content={<ChartTooltipContent nameKey="label" />} /><Pie data={statuses} dataKey="value" nameKey="label" innerRadius={52} outerRadius={85} paddingAngle={2}>{statuses.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie></PieChart></ChartContainer></div><div className="rounded-3xl border bg-card p-5"><h2 className="font-semibold">รายงาน 7 วันล่าสุด</h2><ChartContainer config={{ value: { label: "รายงาน", color: "#0f8b8d" } }} className="mt-4 h-64 w-full"><BarChart data={overTime}><CartesianGrid vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 0, 0]} /></BarChart></ChartContainer></div><div className="rounded-3xl border bg-card p-5 xl:col-span-2"><h2 className="font-semibold">ประเภทปัญหาที่พบบ่อย</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{byCategory.map((item, index) => <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3"><span className="grid size-8 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</span><span className="font-bold">{item.value}</span></div>)}</div></div></div>;
}
