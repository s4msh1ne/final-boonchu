import { eq } from "drizzle-orm";
import { db } from "@/db";
import { systemSettings } from "@/db/schema";
import { saveSettingsFormAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default async function SettingsPage() {
  const [settings] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.id, "default"))
    .limit(1);

  return (
    <div>
      <h1 className="text-3xl font-bold">ตั้งค่าระบบ</h1>
      <p className="mt-2 text-muted-foreground">ข้อมูลติดต่อและชื่อพื้นที่ที่แสดงในระบบ</p>
      <Card className="mt-6 max-w-2xl">
        <CardHeader><CardTitle>ข้อมูลชุมชน</CardTitle></CardHeader>
        <CardContent>
          <form action={saveSettingsFormAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="communityName">ชื่อชุมชน</FieldLabel>
                <Input id="communityName" required name="communityName" defaultValue={settings?.communityName || "เทศบาลเมืองสุพรรณบุรี"} />
              </Field>
              <Field>
                <FieldLabel htmlFor="contactPhone">เบอร์โทรศัพท์ติดต่อ</FieldLabel>
                <Input id="contactPhone" name="contactPhone" type="tel" defaultValue={settings?.contactPhone || ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="contactEmail">อีเมลติดต่อ</FieldLabel>
                <Input id="contactEmail" type="email" name="contactEmail" defaultValue={settings?.contactEmail || ""} />
              </Field>
              <Button type="submit" size="lg" className="w-fit">บันทึกการตั้งค่า</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
