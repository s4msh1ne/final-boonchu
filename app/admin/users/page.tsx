import { asc } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { changeUserRoleAction } from "@/actions/admin";
import { ROLE_LABELS } from "@/lib/constants";
import { formatThaiDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  const query = await searchParams;
  const search = typeof query.search === "string" ? query.search.toLowerCase() : "";
  const allUsers = await db.select().from(user).orderBy(asc(user.createdAt));
  const users = allUsers.filter((item) =>
    !search || item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search),
  );

  return (
    <div>
      <h1 className="text-3xl font-bold">ผู้ใช้งาน</h1>
      <p className="mt-2 text-muted-foreground">กำหนดสิทธิ์เจ้าหน้าที่และผู้ดูแลระบบ</p>
      <form className="mt-6 flex max-w-lg gap-2">
        <Input name="search" defaultValue={search} placeholder="ค้นหาชื่อหรืออีเมล" />
        <Button type="submit">ค้นหา</Button>
      </form>
      <div className="mt-5 rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>ผู้ใช้งาน</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>สมัครเมื่อ</TableHead>
              <TableHead>บทบาท</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id}>
                <TableCell><span className="block font-medium">{item.name}</span><span className="text-xs text-muted-foreground">{ROLE_LABELS[item.role]}</span></TableCell>
                <TableCell className="text-muted-foreground">{item.email}</TableCell>
                <TableCell className="text-muted-foreground">{formatThaiDate(item.createdAt)}</TableCell>
                <TableCell>
                  <form action={changeUserRoleAction} className="flex min-w-56 gap-2">
                    <input type="hidden" name="userId" value={item.id} />
                    <NativeSelect name="role" defaultValue={item.role} className="flex-1">
                      <NativeSelectOption value="resident">สมาชิกชุมชน</NativeSelectOption>
                      <NativeSelectOption value="staff">เจ้าหน้าที่</NativeSelectOption>
                      <NativeSelectOption value="admin">ผู้ดูแลระบบ</NativeSelectOption>
                    </NativeSelect>
                    <Button type="submit" size="sm">บันทึก</Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
