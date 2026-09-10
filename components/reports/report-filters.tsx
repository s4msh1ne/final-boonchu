import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { communityAreas, reportCategories } from "@/db/schema";

export function ReportFilters({
  categories,
  areas,
  staff = false,
  defaults = {},
}: {
  categories: (typeof reportCategories.$inferSelect)[];
  areas: (typeof communityAreas.$inferSelect)[];
  staff?: boolean;
  defaults?: Record<string, string | undefined>;
}) {
  return (
    <form className="grid gap-2 rounded-2xl border bg-card p-3 sm:grid-cols-2 lg:flex">
      <label className="relative min-w-56 flex-1"><span className="sr-only">ค้นหา</span><IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input name="search" defaultValue={defaults.search} placeholder="ค้นหาหัวข้อหรือหมายเลข" className="h-10 pl-9" /></label>
      <select name="status" defaultValue={defaults.status} className="h-10 rounded-xl border bg-background px-3 text-sm"><option value="">ทุกสถานะ</option><option value="pending">รอตรวจสอบ</option><option value="acknowledged">รับเรื่องแล้ว</option><option value="in_progress">กำลังดำเนินการ</option><option value="resolved">แก้ไขแล้ว</option><option value="closed">ปิดเรื่อง</option><option value="rejected">ไม่รับเรื่อง</option></select>
      <select name="category" defaultValue={defaults.category} className="h-10 rounded-xl border bg-background px-3 text-sm"><option value="">ทุกประเภท</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select name="area" defaultValue={defaults.area} className="h-10 rounded-xl border bg-background px-3 text-sm"><option value="">ทุกพื้นที่</option>{areas.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      {staff && <select name="priority" defaultValue={defaults.priority} className="h-10 rounded-xl border bg-background px-3 text-sm"><option value="">ทุกความสำคัญ</option><option value="urgent">เร่งด่วน</option><option value="high">สูง</option><option value="normal">ปกติ</option><option value="low">ต่ำ</option></select>}
      {!staff && <select name="sort" defaultValue={defaults.sort || "latest"} className="h-10 rounded-xl border bg-background px-3 text-sm"><option value="latest">ล่าสุด</option><option value="oldest">เก่าสุด</option><option value="updated">อัปเดตล่าสุด</option></select>}
      <Button type="submit" className="h-10 px-5">ค้นหา</Button>
    </form>
  );
}
