import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { reportCategories, reports } from "@/db/schema";
import { saveCategoryFormAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default async function CategoriesPage() {
  const items = await db
    .select({
      id: reportCategories.id,
      name: reportCategories.name,
      icon: reportCategories.icon,
      isActive: reportCategories.isActive,
      sortOrder: reportCategories.sortOrder,
      reportCount: count(reports.id),
    })
    .from(reportCategories)
    .leftJoin(reports, eq(reports.categoryId, reportCategories.id))
    .groupBy(reportCategories.id)
    .orderBy(asc(reportCategories.sortOrder));

  return (
    <div>
      <h1 className="text-3xl font-bold">ประเภทปัญหา</h1>
      <p className="mt-2 text-muted-foreground">จัดลำดับและเปิดหรือปิดประเภทที่ประชาชนเลือกได้</p>
      <Card className="mt-6">
        <CardHeader><CardTitle>เพิ่มประเภท</CardTitle></CardHeader>
        <CardContent>
          <form action={saveCategoryFormAction} className="grid gap-3 sm:grid-cols-[1fr_160px_100px_auto] sm:items-end">
            <Field><FieldLabel htmlFor="new-category-name">ชื่อ</FieldLabel><Input id="new-category-name" required name="name" /></Field>
            <Field><FieldLabel htmlFor="new-category-icon">ไอคอน</FieldLabel><Input id="new-category-icon" required name="icon" defaultValue="alert-circle" /></Field>
            <Field><FieldLabel htmlFor="new-category-order">ลำดับ</FieldLabel><Input id="new-category-order" required name="sortOrder" type="number" min="0" defaultValue="0" /></Field>
            <input type="hidden" name="isActive" value="on" />
            <Button type="submit" size="lg">เพิ่มประเภท</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <form action={saveCategoryFormAction} key={item.id} className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_150px_90px_110px_auto] sm:items-center">
            <input type="hidden" name="id" value={item.id} />
            <Input name="name" defaultValue={item.name} required aria-label="ชื่อประเภท" />
            <Input name="icon" defaultValue={item.icon} required aria-label="ชื่อไอคอน" />
            <Input name="sortOrder" type="number" min="0" defaultValue={item.sortOrder} required aria-label="ลำดับ" />
            <Field orientation="horizontal">
              <Checkbox id={`category-active-${item.id}`} name="isActive" defaultChecked={item.isActive} />
              <FieldLabel htmlFor={`category-active-${item.id}`}>เปิดใช้</FieldLabel>
            </Field>
            <div className="flex items-center justify-end gap-3">
              <Badge variant="secondary">{item.reportCount} รายงาน</Badge>
              <Button type="submit" variant="outline">บันทึก</Button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
