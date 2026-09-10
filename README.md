# สุพรรณแจ้งได้ (Suphan Alert)

แพลตฟอร์มสำหรับแจ้งและติดตามปัญหาในเขตเมืองสุพรรณบุรี สร้างด้วย Next.js 16, Better Auth, Drizzle ORM และ PostgreSQL

## เริ่มต้นใช้งาน

1. กำหนด `POSTGRES_URL`, `BETTER_AUTH_SECRET` และ `BETTER_AUTH_URL` ใน `.env`
2. รัน `bun run db:migrate`
3. รัน `bun run db:seed`
4. เริ่มระบบด้วย `bun dev`

## บัญชีสาธิต

- ผู้ดูแล: `admin@example.com`
- เจ้าหน้าที่: `staff@example.com`
- สมาชิก: `resident@example.com`
- รหัสผ่านสำหรับ development: ค่า `SEED_PASSWORD` หรือ `Community123!` เมื่อไม่ได้กำหนด

ห้ามใช้รหัสผ่านสาธิตในระบบ production

## คำสั่งสำคัญ

- `bun run typecheck`
- `bun run lint`
- `bun run build`
- `bun run db:generate`
- `bun run db:migrate`
- `bun run db:seed`
