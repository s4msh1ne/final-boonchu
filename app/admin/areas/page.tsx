import { asc, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { communityAreas, reports } from "@/db/schema";
import { saveAreaFormAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default async function AreasPage() {
  const items = await db
    .select({
      id: communityAreas.id,
      name: communityAreas.name,
      description: communityAreas.description,
      isActive: communityAreas.isActive,
      reportCount: count(reports.id),
    })
    .from(communityAreas)
    .leftJoin(reports, eq(reports.areaId, communityAreas.id))
    .groupBy(communityAreas.id)
    .orderBy(asc(communityAreas.name));

  return (
    <div>
      <h1 className="text-3xl font-bold">พื้นที่ชุมชน</h1>
      <p className="mt-2 text-muted-foreground">จัดการหมู่บ้านและพื้นที่รับผิดชอบโดยไม่ลบประวัติเดิม</p>
      <Card className="mt-6">
        <CardHeader><CardTitle>เพิ่มพื้นที่</CardTitle></CardHeader>
        <CardContent>
          <form action={saveAreaFormAction} className="grid gap-3 sm:grid-cols-[1fr_1.5fr_auto] sm:items-end">
            <Field><FieldLabel htmlFor="new-area-name">ชื่อพื้นที่</FieldLabel><Input id="new-area-name" required name="name" /></Field>
            <Field><FieldLabel htmlFor="new-area-description">รายละเอียด</FieldLabel><Input id="new-area-description" name="description" /></Field>
            <input type="hidden" name="isActive" value="on" />
            <Button type="submit" size="lg">เพิ่มพื้นที่</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <form action={saveAreaFormAction} key={item.id} className="grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_1.5fr_110px_auto] sm:items-center">
            <input type="hidden" name="id" value={item.id} />
            <Input required name="name" defaultValue={item.name} aria-label="ชื่อพื้นที่" />
            <Input name="description" defaultValue={item.description || ""} aria-label="รายละเอียด" />
            <Field orientation="horizontal">
              <Checkbox id={`area-active-${item.id}`} name="isActive" defaultChecked={item.isActive} />
              <FieldLabel htmlFor={`area-active-${item.id}`}>เปิดใช้</FieldLabel>
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
