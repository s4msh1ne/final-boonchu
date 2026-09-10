import "dotenv/config";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { communityAreas, reportCategories, reportComments, reports, reportUpdates, session, user, type ReportStatus } from "@/db/schema";

const password = process.env.SEED_PASSWORD || "Community123!";
const people = [
  ["ผู้ดูแลระบบ", "admin@example.com", "admin"],
  ["สมชาย ใจดี", "staff@example.com", "staff"],
  ["วรรณา สุขใจ", "staff2@example.com", "staff"],
  ["อาทิตย์ มั่นคง", "staff3@example.com", "staff"],
  ["มานี มีสุข", "resident@example.com", "resident"],
  ["ปิติ ชื่นใจ", "resident2@example.com", "resident"],
  ["ชูใจ รักชุมชน", "resident3@example.com", "resident"],
  ["สมศรี บ้านสวน", "resident4@example.com", "resident"],
  ["วิชัย ริมคลอง", "resident5@example.com", "resident"],
  ["นภา ตลาดเก่า", "resident6@example.com", "resident"],
  ["เกรียงไกร ร่วมใจ", "resident7@example.com", "resident"],
  ["เดือนเพ็ญ ใจอาสา", "resident8@example.com", "resident"],
] as const;

async function seedUsers() {
  for (const [name, email, role] of people) {
    const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
    let id = existing?.id;
    if (!id) {
      const created = await auth.api.signUpEmail({ body: { name, email, password, phoneNumber: "0800000000" } });
      id = created.user.id;
    }
    await db.update(user).set({ role }).where(eq(user.id, id));
    await db.delete(session).where(eq(session.userId, id));
  }
}

async function main() {
  await seedUsers();
  for (const [index, [name, icon]] of DEFAULT_CATEGORIES.entries()) {
    await db.insert(reportCategories).values({ name, icon, sortOrder: index }).onConflictDoUpdate({ target: reportCategories.name, set: { icon, sortOrder: index, isActive: true } });
  }
  for (const [name, description] of [
    ["ตำบลท่าพี่เลี้ยง", "เขตเมืองและศูนย์ราชการจังหวัดสุพรรณบุรี"],
    ["ตำบลรั้วใหญ่", "พื้นที่วัดป่าเลไลยก์และชุมชนโดยรอบ"],
    ["ตำบลทับตีเหล็ก", "พื้นที่ชุมชนด้านตะวันออกของตัวเมือง"],
    ["ตำบลสนามชัย", "พื้นที่สนามกีฬาและชุมชนโดยรอบ"],
    ["ตำบลโพธิ์พระยา", "พื้นที่ชุมชนริมแม่น้ำท่าจีน"],
  ]) {
    await db.insert(communityAreas).values({ name, description }).onConflictDoUpdate({ target: communityAreas.name, set: { description, isActive: true } });
  }

  const existingReports = await db.select({ id: reports.id }).from(reports).limit(1);
  if (existingReports.length) return;
  const categories = await db.select().from(reportCategories);
  const areas = await db.select().from(communityAreas);
  const users = await db.select().from(user);
  const residents = users.filter((item) => item.role === "resident");
  const staff = users.filter((item) => item.role === "staff");
  const titles = [
    "ไฟถนนใกล้วัดป่าเลไลยก์ไม่ติด",
    "ถนนมาลัยแมนมีหลุมขนาดใหญ่",
    "มีขยะสะสมบริเวณคลองเณรแก้ว",
    "ท่อระบายน้ำอุดตันใกล้ตลาดทรัพย์สิน",
    "น้ำประปารั่วบริเวณถนนพระพันวษา",
    "ต้นไม้ล้มกีดขวางทางใกล้ศาลเจ้าพ่อหลักเมือง",
    "ทางเท้าชำรุดบริเวณถนนหมื่นหาญ",
    "เสียงดังจากพื้นที่ก่อสร้างริมแม่น้ำท่าจีน",
    "ฝาท่อระบายน้ำชำรุดหน้าสถานีขนส่ง",
    "สุนัขจรจัดรวมกลุ่มบริเวณตลาดเทศบาล",
  ];
  const streets = [
    "ถนนมาลัยแมน",
    "ถนนพระพันวษา",
    "ถนนหมื่นหาญ",
    "ถนนนางพิม",
    "ถนนเณรแก้ว",
  ];
  const landmarks = [
    "ใกล้วัดป่าเลไลยก์วรวิหาร",
    "ใกล้ตลาดทรัพย์สินพระมหากษัตริย์",
    "ใกล้ศาลเจ้าพ่อหลักเมืองสุพรรณบุรี",
    "บริเวณริมแม่น้ำท่าจีน",
  ];
  const statuses: ReportStatus[] = ["pending", "acknowledged", "in_progress", "resolved", "closed", "rejected"];
  for (let index = 0; index < 36; index++) {
    const status = statuses[index % statuses.length];
    const createdAt = new Date(Date.now() - index * 7 * 60 * 60 * 1000);
    const [created] = await db.insert(reports).values({
      title: titles[index % titles.length],
      description: `พบปัญหา${titles[index % titles.length]} ส่งผลต่อการสัญจรและการใช้ชีวิตของสมาชิกในชุมชน กรุณาเข้าตรวจสอบพื้นที่และดำเนินการแก้ไข`,
      status,
      priority: index % 9 === 0 ? "urgent" : index % 4 === 0 ? "high" : "normal",
      residentUrgency: index % 5 === 0 ? "high" : "normal",
      categoryId: categories[index % categories.length].id,
      reporterId: residents[index % residents.length].id,
      assignedToId: status === "pending" ? null : staff[index % staff.length].id,
      areaId: areas[index % areas.length].id,
      address: `${12 + index} ${streets[index % streets.length]} อำเภอเมืองสุพรรณบุรี จังหวัดสุพรรณบุรี`,
      landmark: landmarks[index % landmarks.length],
      latitude: 14.4745 + (index % 8) * 0.002,
      longitude: 100.1177 + (index % 6) * 0.002,
      isPublic: index % 8 !== 0,
      createdAt,
      acknowledgedAt: status !== "pending" ? new Date(createdAt.getTime() + 60 * 60 * 1000) : null,
      resolvedAt: status === "resolved" || status === "closed" ? new Date(createdAt.getTime() + 20 * 60 * 60 * 1000) : null,
      closedAt: status === "closed" ? new Date(createdAt.getTime() + 25 * 60 * 60 * 1000) : null,
    }).returning();
    const updates = [{ reportId: created.id, authorId: created.reporterId, type: "system" as const, message: "ส่งรายงานเข้าสู่ระบบแล้ว รอเจ้าหน้าที่ตรวจสอบ", newStatus: "pending" as const, createdAt }];
    if (status !== "pending") updates.push({ reportId: created.id, authorId: staff[index % staff.length].id, type: "system", message: "เจ้าหน้าที่รับเรื่องและตรวจสอบข้อมูลแล้ว", newStatus: "pending", createdAt: new Date(createdAt.getTime() + 60 * 60 * 1000) });
    await db.insert(reportUpdates).values(updates);
    if (index % 3 === 0) await db.insert(reportComments).values({ reportId: created.id, authorId: created.reporterId, message: "ขณะนี้ปัญหายังเกิดขึ้นอยู่ รบกวนเจ้าหน้าที่ช่วยตรวจสอบด้วยครับ", createdAt: new Date(createdAt.getTime() + 2 * 60 * 60 * 1000) });
  }
}

main().then(() => { console.log(`Seed complete. Demo password: ${password}`); process.exit(0); }).catch((error) => { console.error(error); process.exit(1); });
