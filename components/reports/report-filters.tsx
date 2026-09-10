import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
      <NativeSelect name="status" defaultValue={defaults.status} className="w-full lg:w-auto"><NativeSelectOption value="">ทุกสถานะ</NativeSelectOption><NativeSelectOption value="pending">รอตรวจสอบ</NativeSelectOption><NativeSelectOption value="acknowledged">รับเรื่องแล้ว</NativeSelectOption><NativeSelectOption value="in_progress">กำลังดำเนินการ</NativeSelectOption><NativeSelectOption value="resolved">แก้ไขแล้ว</NativeSelectOption><NativeSelectOption value="closed">ปิดเรื่อง</NativeSelectOption><NativeSelectOption value="rejected">ไม่รับเรื่อง</NativeSelectOption></NativeSelect>
      <NativeSelect name="category" defaultValue={defaults.category} className="w-full lg:w-auto"><NativeSelectOption value="">ทุกประเภท</NativeSelectOption>{categories.map((item) => <NativeSelectOption key={item.id} value={item.id}>{item.name}</NativeSelectOption>)}</NativeSelect>
      <NativeSelect name="area" defaultValue={defaults.area} className="w-full lg:w-auto"><NativeSelectOption value="">ทุกพื้นที่</NativeSelectOption>{areas.map((item) => <NativeSelectOption key={item.id} value={item.id}>{item.name}</NativeSelectOption>)}</NativeSelect>
      {staff && <NativeSelect name="priority" defaultValue={defaults.priority} className="w-full lg:w-auto"><NativeSelectOption value="">ทุกความสำคัญ</NativeSelectOption><NativeSelectOption value="urgent">เร่งด่วน</NativeSelectOption><NativeSelectOption value="high">สูง</NativeSelectOption><NativeSelectOption value="normal">ปกติ</NativeSelectOption><NativeSelectOption value="low">ต่ำ</NativeSelectOption></NativeSelect>}
      {!staff && <NativeSelect name="sort" defaultValue={defaults.sort || "latest"} className="w-full lg:w-auto"><NativeSelectOption value="latest">ล่าสุด</NativeSelectOption><NativeSelectOption value="oldest">เก่าสุด</NativeSelectOption><NativeSelectOption value="updated">อัปเดตล่าสุด</NativeSelectOption></NativeSelect>}
      <Button type="submit" className="h-10 px-5">ค้นหา</Button>
    </form>
  );
}
