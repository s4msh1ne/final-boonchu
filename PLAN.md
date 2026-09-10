Build a production-quality full-stack web application called **Community Alert** for reporting and tracking local community problems.

The application is intended for Thai communities, municipalities, villages, local administrative organizations, volunteers, and residents.

The core idea is:

> Residents can report problems in their community such as broken street lights, damaged roads, garbage, water leaks, flooding, dangerous areas, and public infrastructure problems. Local staff can receive the reports, assign responsibility, update progress, and mark problems as resolved.

The UI language must be **Thai**.

---

# 1. Tech Stack

Use the following stack:

* Next.js latest stable
* App Router
* TypeScript
* React
* Tailwind CSS
* shadcn/ui
* Base UI primitives where appropriate
* Better Auth
* Drizzle ORM
* PostgreSQL
* Zod
* React Hook Form
* Lucide Icons or Tabler Icons
* date-fns
* Thai locale for date formatting
* Server Actions where appropriate
* Next.js Route Handlers only where APIs are necessary

Use Bun as the package manager.

Prefer server components by default.

Only use `"use client"` when interactivity requires it.

Keep code strongly typed.

Avoid unnecessary dependencies.

---

# 2. Application Name

Thai name:

**แจ้งปัญหาชุมชน**

English name:

**Community Alert**

Tagline:

**ร่วมแจ้ง ร่วมติดตาม ร่วมพัฒนาชุมชน**

Description:

**แพลตฟอร์มสำหรับแจ้งและติดตามปัญหาที่เกิดขึ้นภายในชุมชน เพื่อช่วยให้ประชาชนและหน่วยงานในพื้นที่สามารถประสานงานและแก้ไขปัญหาได้อย่างมีประสิทธิภาพ**

---

# 3. Target Users

There are 3 user roles.

## Resident

Normal community member.

Permissions:

* register
* login
* create reports
* upload report images
* select report location
* view their reports
* track report progress
* view public reports
* comment on their own reports
* confirm that a problem has actually been resolved

Role value:

```ts
resident
```

---

## Staff

Community staff / municipality / village staff / อสม. / อปพร.

Permissions:

* see all reports
* update report status
* assign reports
* add internal or public updates
* classify reports
* adjust priority
* mark reports as resolved
* view operational dashboard

Role value:

```ts
staff
```

---

## Admin

System administrator.

Permissions:

Everything Staff can do plus:

* manage users
* manage staff
* manage report categories
* manage community areas
* change user roles
* manage system settings

Role value:

```ts
admin
```

---

# 4. Main Problem Reporting Flow

The primary workflow should be:

1. User logs in
2. User clicks **แจ้งปัญหา**
3. User selects problem category
4. User enters problem title
5. User enters description
6. User uploads one or more images
7. User chooses location
8. User submits report
9. System generates report number
10. Staff receives report
11. Staff reviews report
12. Staff changes status to acknowledged
13. Staff assigns responsible staff if necessary
14. Staff starts work
15. Staff posts progress updates
16. Staff marks report as resolved
17. Reporter can confirm resolution
18. Report is closed

Example:

```txt
REP-2026-000142
```

---

# 5. Report Status

Use these statuses:

```ts
pending
acknowledged
in_progress
resolved
closed
rejected
```

Thai labels:

```ts
pending: "รอตรวจสอบ"
acknowledged: "รับเรื่องแล้ว"
in_progress: "กำลังดำเนินการ"
resolved: "แก้ไขแล้ว"
closed: "ปิดเรื่อง"
rejected: "ไม่รับเรื่อง"
```

Status progression should normally be:

```txt
รอตรวจสอบ
↓
รับเรื่องแล้ว
↓
กำลังดำเนินการ
↓
แก้ไขแล้ว
↓
ปิดเรื่อง
```

Show status visually using badges.

Do not use overly aggressive colors.

---

# 6. Priority

Reports can have priority:

```ts
low
normal
high
urgent
```

Thai labels:

```txt
ต่ำ
ปกติ
สูง
เร่งด่วน
```

Residents should NOT directly decide official priority.

They may optionally select:

```txt
ความเร่งด่วนที่ผู้แจ้งประเมิน
```

But Staff determines the final official priority.

---

# 7. Problem Categories

Default report categories:

```txt
ไฟถนน / ไฟสาธารณะ
ถนนและทางเท้า
ขยะและสิ่งปฏิกูล
น้ำประปา
ท่อระบายน้ำ
น้ำท่วม
ต้นไม้ / กิ่งไม้
พื้นที่อันตราย
สัตว์จรจัด
มลพิษ / กลิ่น / เสียง
ทรัพย์สินสาธารณะ
เหตุฉุกเฉินในชุมชน
อื่น ๆ
```

Category should be stored in the database.

Admins can:

* create
* edit
* disable
* reorder categories

Do not hard-code the categories into every form.

---

# 8. Authentication

Use **Better Auth**.

Initial authentication methods:

* email
* password

Users must have:

```ts
id
name
email
emailVerified
image
role
phoneNumber
createdAt
updatedAt
```

Default role:

```ts
resident
```

Never allow a new user to choose `staff` or `admin` during registration.

Staff/Admin roles must be assigned by Admin.

Create authorization helpers such as:

```ts
requireUser()
requireStaff()
requireAdmin()
```

Protect dashboard routes on the server.

Never rely only on UI checks for authorization.

---

# 9. Database

Use:

* PostgreSQL
* Drizzle ORM
* drizzle-kit

Create clean relational schemas.

Suggested database tables:

```txt
users
sessions
accounts
verifications

reports
reportCategories
reportImages
reportUpdates
reportComments

communityAreas
reportAssignments

notifications
```

---

# 10. Reports Schema

Create a `reports` table containing approximately:

```ts
id
reportNumber
title
description

status
priority

categoryId
reporterId
assignedToId

areaId

address
latitude
longitude

landmark

isPublic

createdAt
updatedAt
acknowledgedAt
resolvedAt
closedAt
```

Use UUID or generated IDs internally.

`reportNumber` should be human readable.

Example:

```txt
REP-2026-000001
```

Report numbers must be unique.

---

# 11. Report Images

Create a separate table:

```ts
reportImages
```

Fields:

```ts
id
reportId
url
objectKey
order
createdAt
```

Allow:

* JPG
* JPEG
* PNG
* WEBP

Maximum recommended images:

```txt
5 images per report
```

Build the upload system so storage implementation can be replaced later.

Create an abstraction such as:

```ts
uploadFile()
deleteFile()
```

Do not tightly couple report logic to one storage provider.

For development, local/mock storage is acceptable.

Production architecture should support S3-compatible object storage.

---

# 12. Community Areas

Reports should optionally belong to a community area.

Example:

```txt
หมู่ 1
หมู่ 2
หมู่ 3
ชุมชนตลาดเก่า
ชุมชนริมคลอง
```

Create:

```ts
communityAreas
```

Fields:

```ts
id
name
description
isActive
createdAt
updatedAt
```

Admin can manage these areas.

---

# 13. Location

When creating a report, users should be able to:

* use current device location
* manually place a map marker
* type an address
* specify a nearby landmark

Fields:

```txt
ตำแหน่งที่เกิดปัญหา
ที่อยู่
จุดสังเกต
ละติจูด
ลองจิจูด
```

Use browser geolocation where available.

Handle permission denial gracefully.

Example message:

```txt
ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้ กรุณาเลือกตำแหน่งบนแผนที่ด้วยตนเอง
```

Create the map feature as a reusable component.

Prefer an open map provider / MapLibre-style implementation rather than coupling the application tightly to Google Maps.

---

# 14. Report Updates

Staff should be able to post progress updates.

Examples:

```txt
เจ้าหน้าที่รับเรื่องแล้ว
```

```txt
ประสานงานกับฝ่ายสาธารณูปโภคแล้ว
```

```txt
เจ้าหน้าที่เข้าตรวจสอบพื้นที่แล้ว
```

```txt
เปลี่ยนหลอดไฟสาธารณะเรียบร้อยแล้ว
```

Create:

```ts
reportUpdates
```

Fields:

```ts
id
reportId
authorId
type
message
oldStatus
newStatus
isPublic
createdAt
```

Update types could include:

```ts
status_change
comment
assignment
system
```

Display updates in a vertical timeline.

Newest or oldest order can be selected, but default report detail should clearly show chronological progression.

---

# 15. Comments

Residents can comment on their own reports.

Example:

```txt
ปัญหายังเกิดขึ้นอยู่ครับ
```

Staff can respond.

Comments contain:

```ts
id
reportId
authorId
message
createdAt
updatedAt
```

Do not mix operational history and normal comments in the same conceptual UI.

Use:

* Timeline = official report progress
* Comments = conversation

---

# 16. Assignment

Staff reports can be assigned to a staff member.

Display:

```txt
ผู้รับผิดชอบ
```

Possible states:

```txt
ยังไม่ได้มอบหมาย
สมชาย ใจดี
```

Allow Admin/Staff with appropriate permission to assign or reassign reports.

Record assignment changes in report history.

---

# 17. Notifications

Create an in-app notification system.

Possible notifications:

```txt
รายงานของคุณได้รับการรับเรื่องแล้ว
```

```txt
เจ้าหน้าที่กำลังดำเนินการแก้ไขปัญหาที่คุณแจ้ง
```

```txt
ปัญหาที่คุณแจ้งได้รับการแก้ไขแล้ว
```

```txt
มีความคิดเห็นใหม่ในรายงานของคุณ
```

Notification fields:

```ts
id
userId
type
title
message
readAt
metadata
createdAt
```

Create a notification dropdown in the navbar.

Show unread notification count.

---

# 18. Public Pages

Create public-facing pages.

## Homepage

Route:

```txt
/
```

Sections:

### Hero

Title:

```txt
แจ้งปัญหาในชุมชนได้ง่าย ติดตามการแก้ไขได้ทุกขั้นตอน
```

Description:

```txt
ร่วมเป็นส่วนหนึ่งในการพัฒนาชุมชน แจ้งปัญหาที่พบและติดตามการดำเนินงานจากหน่วยงานในพื้นที่ได้อย่างโปร่งใส
```

Buttons:

```txt
แจ้งปัญหา
ดูปัญหาในชุมชน
```

---

### Statistics

Show:

```txt
ปัญหาที่แจ้งทั้งหมด
กำลังดำเนินการ
แก้ไขแล้ว
พื้นที่ที่เข้าร่วม
```

---

### Recent Reports

Show latest public reports.

Card contains:

```txt
category
title
area
createdAt
status
thumbnail
```

---

### How It Works

3 steps:

```txt
1. แจ้งปัญหา
ถ่ายรูปและระบุตำแหน่งของปัญหา
```

```txt
2. เจ้าหน้าที่รับเรื่อง
หน่วยงานในพื้นที่ตรวจสอบและดำเนินการ
```

```txt
3. ติดตามผล
ตรวจสอบความคืบหน้าได้ทุกขั้นตอน
```

---

# 19. Public Reports

Route:

```txt
/reports
```

Users can browse public reports.

Provide:

* search
* category filter
* status filter
* area filter
* date filter
* sort

Sorting:

```txt
ล่าสุด
เก่าสุด
อัปเดตล่าสุด
```

Display as:

* cards
* optional map view

---

# 20. Report Detail Page

Route:

```txt
/reports/[id]
```

Show:

```txt
report number
title
status
category
priority
description
images
location
map
address
landmark
reporter
created date
last updated
assigned staff
timeline
comments
```

If public:

Show reporter privacy-conscious information.

Do not expose:

* email
* phone number

Possible reporter display:

```txt
ผู้แจ้ง: สมาชิกในชุมชน
```

or optionally first name only.

---

# 21. Create Report

Route:

```txt
/report/new
```

Use a polished multi-section form.

Fields:

### ประเภทปัญหา

Required.

### หัวข้อปัญหา

Example placeholder:

```txt
ไฟถนนบริเวณหน้าซอยไม่ติด
```

### รายละเอียด

Placeholder:

```txt
อธิบายปัญหาที่พบเพิ่มเติม เพื่อช่วยให้เจ้าหน้าที่ตรวจสอบได้ง่ายขึ้น
```

### รูปภาพ

Upload up to 5.

Display preview.

Allow removing before submitting.

### ตำแหน่ง

Options:

```txt
ใช้ตำแหน่งปัจจุบัน
เลือกบนแผนที่
```

### ที่อยู่

### จุดสังเกต

Example:

```txt
บริเวณหน้าร้านค้า ใกล้ศาลาชุมชน
```

### Visibility

Checkbox:

```txt
อนุญาตให้แสดงรายงานนี้ต่อสาธารณะ
```

Default:

```txt
true
```

Submit button:

```txt
ส่งรายงาน
```

---

# 22. Submission Success

After report creation display:

```txt
แจ้งปัญหาสำเร็จ
```

```txt
เจ้าหน้าที่ได้รับรายงานของคุณแล้ว คุณสามารถติดตามสถานะการดำเนินงานได้จากหน้ารายงานของฉัน
```

Show report number.

Example:

```txt
หมายเลขรายงาน: REP-2026-000142
```

Buttons:

```txt
ดูรายงาน
กลับหน้าหลัก
```

---

# 23. Resident Dashboard

Route:

```txt
/dashboard
```

Resident dashboard should show:

Cards:

```txt
รายงานทั้งหมด
รอตรวจสอบ
กำลังดำเนินการ
แก้ไขแล้ว
```

Section:

```txt
รายงานล่าสุดของฉัน
```

Provide table/list.

Columns:

```txt
หมายเลข
ปัญหา
ประเภท
วันที่แจ้ง
สถานะ
```

CTA:

```txt
แจ้งปัญหาใหม่
```

---

# 24. My Reports

Route:

```txt
/dashboard/reports
```

Only show current user's reports.

Filters:

```txt
ค้นหา
สถานะ
ประเภท
ช่วงวันที่
```

Use a responsive data table.

On mobile, consider cards instead of forcing a wide table.

---

# 25. Staff Dashboard

Route:

```txt
/staff
```

Dashboard metrics:

```txt
รายงานทั้งหมด
รอตรวจสอบ
กำลังดำเนินการ
เร่งด่วน
แก้ไขแล้ววันนี้
```

Charts:

### Reports by status

### Reports by category

### Reports over time

### Reports by community area

Also show:

```txt
รายงานล่าสุด
รายงานเร่งด่วน
รายงานที่ยังไม่มีผู้รับผิดชอบ
```

Avoid chart overload.

Prioritize operational usefulness.

---

# 26. Staff Report Management

Route:

```txt
/staff/reports
```

Create an operational DataTable.

Columns:

```txt
หมายเลข
ปัญหา
ประเภท
พื้นที่
ผู้แจ้ง
ผู้รับผิดชอบ
ความสำคัญ
สถานะ
วันที่แจ้ง
```

Filters:

```txt
search
status
category
area
priority
assignee
```

Quick actions:

```txt
รับเรื่อง
มอบหมาย
เริ่มดำเนินการ
แก้ไขแล้ว
```

More actions through DropdownMenu.

---

# 27. Staff Report Detail

Route:

```txt
/staff/reports/[id]
```

Layout:

Main content:

* report information
* images
* map
* timeline
* comments

Sidebar:

```txt
สถานะ
ความสำคัญ
ผู้รับผิดชอบ
พื้นที่
วันที่แจ้ง
```

Staff actions:

```txt
รับเรื่อง
เริ่มดำเนินการ
เพิ่มความคืบหน้า
เปลี่ยนผู้รับผิดชอบ
ทำเครื่องหมายว่าแก้ไขแล้ว
ปฏิเสธรายงาน
```

Use dialogs for important actions.

Require reason when rejecting a report.

---

# 28. Admin Dashboard

Route:

```txt
/admin
```

Admin pages:

```txt
/admin/users
/admin/categories
/admin/areas
/admin/settings
```

---

# 29. User Management

Admin can:

* search users
* view user profile
* change role
* disable staff privilege
* promote resident to staff

Never allow an Admin to accidentally remove the last Admin account.

---

# 30. Category Management

Page:

```txt
/admin/categories
```

Create table:

```txt
ชื่อ
ไอคอน
สถานะ
ลำดับ
จำนวนรายงาน
```

Actions:

```txt
เพิ่มประเภท
แก้ไข
เปิดใช้งาน
ปิดใช้งาน
```

Use soft disabling rather than deleting categories referenced by existing reports.

---

# 31. Area Management

Page:

```txt
/admin/areas
```

Allow:

```txt
เพิ่มพื้นที่
แก้ไขพื้นที่
เปิด/ปิดพื้นที่
```

Do not delete areas with historical reports.

---

# 32. Navigation

Public navbar:

```txt
หน้าหลัก
ปัญหาในชุมชน
แจ้งปัญหา
```

Authenticated user:

```txt
แดชบอร์ด
รายงานของฉัน
แจ้งปัญหา
```

Staff:

```txt
ภาพรวม
จัดการรายงาน
```

Admin:

```txt
ผู้ใช้งาน
ประเภทปัญหา
พื้นที่ชุมชน
ตั้งค่า
```

Right side:

```txt
notifications
user avatar
dropdown
```

Dropdown:

```txt
บัญชีของฉัน
แดชบอร์ด
ออกจากระบบ
```

---

# 33. Design System

The application should look like a modern Thai government/community service platform but NOT feel outdated.

Design direction:

* clean
* modern
* trustworthy
* friendly
* professional
* accessible
* mobile-first

Use plenty of whitespace.

Use subtle borders.

Use rounded cards.

Avoid excessive gradients.

Avoid huge decorative hero illustrations.

Use icons meaningfully.

Prefer practical dashboard layouts.

Use shadcn/ui components heavily.

Examples:

```txt
Button
Card
Badge
Dialog
DropdownMenu
Sheet
Tabs
Table
DataTable
Select
Command
Popover
Tooltip
Alert
Avatar
Breadcrumb
Pagination
Skeleton
Textarea
Input
Form
Calendar
```

---

# 34. Responsive Design

Must work well on:

```txt
mobile
tablet
desktop
```

Important:

The reporting workflow is likely to be used from smartphones.

Therefore `/report/new` must have excellent mobile UX.

Avoid tiny interactive targets.

Use bottom spacing where needed.

Forms should be easy to complete using one hand.

---

# 35. Thai Date Formatting

Use:

```ts
date-fns
```

with Thai locale.

Display dates such as:

```txt
7 กันยายน 2569
```

For timestamps:

```txt
7 กันยายน 2569 เวลา 10:30 น.
```

Relative time examples:

```txt
5 นาทีที่แล้ว
2 ชั่วโมงที่แล้ว
เมื่อวาน
```

Be consistent about Buddhist Era display where it appears in the UI.

Database values must remain standard UTC timestamps.

---

# 36. Validation

Use:

```txt
Zod
React Hook Form
```

Example validation:

Title:

```txt
minimum 5 characters
maximum 150 characters
```

Description:

```txt
minimum 10 characters
maximum 3000 characters
```

Images:

```txt
maximum 5
```

Validate files by:

```txt
size
mime type
count
```

Always validate again on the server.

Never trust client-side validation alone.

---

# 37. Error States

Create good empty/error states.

Examples:

### No reports

```txt
ยังไม่มีรายงาน
เมื่อพบปัญหาในชุมชน คุณสามารถแจ้งให้เจ้าหน้าที่ทราบได้ที่นี่
```

Button:

```txt
แจ้งปัญหา
```

---

### Staff no pending reports

```txt
ไม่มีรายงานที่รอตรวจสอบ
รายงานทั้งหมดได้รับการตรวจสอบแล้ว
```

---

### Search no result

```txt
ไม่พบรายงานที่ตรงกับการค้นหา
ลองเปลี่ยนคำค้นหาหรือตัวกรอง
```

---

# 38. Loading UX

Use:

* Skeleton
* loading.tsx
* Suspense where useful

Avoid full-screen spinners whenever possible.

---

# 39. Search Parameters

Store table filters in URL search parameters where practical.

Example:

```txt
/staff/reports?status=pending&category=road&page=2
```

This allows:

* refresh without losing filters
* copying filtered URLs
* browser navigation

---

# 40. Pagination

Use server-side pagination.

Do not fetch thousands of reports and paginate only in React.

Support:

```txt
page
pageSize
search
status
category
area
priority
```

---

# 41. Security

Implement:

* server-side authorization
* input validation
* file validation
* secure session handling
* role checks
* ownership checks
* SQL injection protection through Drizzle
* XSS-safe rendering
* rate limiting architecture for report creation
* CSRF protections where relevant through authentication framework

Residents may only modify data they own.

Staff cannot access Admin-only configuration.

Never trust a role sent from the client.

---

# 42. Privacy

Do not publicly display:

```txt
email
phone number
exact private user details
```

Public reports should focus on:

```txt
problem
location
progress
status
```

Not personal information.

---

# 43. Suggested Project Structure

Use a clean structure similar to:

```txt
src/
  app/
    (public)/
      page.tsx
      reports/
        page.tsx
        [id]/
          page.tsx

    (auth)/
      login/
      register/

    dashboard/
      page.tsx
      reports/

    staff/
      page.tsx
      reports/
        page.tsx
        [id]/

    admin/
      page.tsx
      users/
      categories/
      areas/

    report/
      new/

  components/
    ui/

    auth/

    reports/
      report-card.tsx
      report-status-badge.tsx
      report-form.tsx
      report-images.tsx
      report-map.tsx
      report-timeline.tsx

    dashboard/

    layout/

  db/
    index.ts
    schema/
      auth.ts
      reports.ts
      report-categories.ts
      report-images.ts
      report-updates.ts
      comments.ts
      areas.ts
      notifications.ts

  lib/
    auth.ts
    permissions.ts
    validations/
    storage/
    utils/

  actions/
    reports.ts
    comments.ts
    staff.ts
    admin.ts
```

Do not force this exact structure if a cleaner architecture is appropriate.

---

# 44. Server Actions

Prefer Server Actions for mutations such as:

```txt
create report
update report
post comment
change status
assign staff
create category
update category
mark notification read
```

Return typed results.

Example pattern:

```ts
type ActionResult<T = undefined> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };
```

---

# 45. Confirmation Dialogs

Require confirmation for destructive or important actions.

Examples:

```txt
ปฏิเสธรายงานนี้หรือไม่
```

```txt
ยืนยันว่าปัญหานี้ได้รับการแก้ไขแล้วหรือไม่
```

Avoid browser `confirm()`.

Use shadcn AlertDialog.

---

# 46. Toast Notifications

Success examples:

```txt
ส่งรายงานเรียบร้อยแล้ว
```

```txt
อัปเดตสถานะเรียบร้อยแล้ว
```

```txt
มอบหมายเจ้าหน้าที่เรียบร้อยแล้ว
```

Errors:

```txt
ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง
```

Prefer a proper toast component.

---

# 47. Demo Seed Data

Create a seed script.

Seed:

```txt
1 admin
3 staff
8 residents

8-12 categories
5 community areas
30-50 reports
report progress histories
comments
```

Example reports:

```txt
ไฟถนนหน้าซอย 4 ไม่ติด
ถนนบริเวณตลาดมีหลุมขนาดใหญ่
มีขยะสะสมบริเวณคลอง
ท่อระบายน้ำอุดตันหน้าศาลาชุมชน
น้ำประปารั่วบริเวณถนนหลัก
ต้นไม้ล้มกีดขวางทาง
```

Create reports across different statuses.

This should make the dashboard look realistic immediately after seeding.

---

# 48. Demo Accounts

Development seed accounts can include:

```txt
admin@example.com
staff@example.com
resident@example.com
```

Use a documented development-only password.

Do NOT hardcode production credentials.

---

# 49. Dashboard Data

Create actual database queries for all dashboard statistics.

Do not hard-code statistics in React.

Example:

```txt
total reports
pending reports
in progress
resolved
urgent
average resolution time
```

If displaying percentages, calculate them from database records.

---

# 50. Useful Additional Metric

Calculate:

```txt
เวลาเฉลี่ยในการแก้ไข
```

Based on:

```txt
createdAt → resolvedAt
```

Example:

```txt
เฉลี่ย 1 วัน 4 ชั่วโมง
```

This can demonstrate improved community operational efficiency.

---

# 51. Map Dashboard

Staff should have a simple map view of active reports.

Use pins based on status/category.

Clicking a marker shows:

```txt
report number
title
status
category
```

Click:

```txt
ดูรายละเอียด
```

Do not load excessive markers at once.

---

# 52. Home Community Impact Section

Add a section that demonstrates impact.

Example:

```txt
ชุมชนดีขึ้นได้ เมื่อทุกคนช่วยกัน
```

Metrics:

```txt
89% ของรายงานได้รับการดำเนินการ
124 ปัญหาได้รับการแก้ไข
เฉลี่ย 1.4 วันต่อการแก้ไขหนึ่งปัญหา
```

These values must come from actual database data if available.

For empty/demo systems, use appropriate empty presentation rather than fake production statistics.

---

# 53. Accessibility

Ensure:

* semantic HTML
* keyboard navigation
* labels on all form controls
* correct contrast
* image alt text
* accessible dialogs
* focus states

Do not remove outlines without an accessible replacement.

---

# 54. Performance

Use:

* Next Image
* server components
* server-side queries
* pagination
* revalidation
* optimized image uploads

Avoid fetching unnecessary report fields.

Create database indexes for commonly queried fields:

```txt
status
categoryId
reporterId
assignedToId
areaId
createdAt
priority
```

---

# 55. SEO

Public pages should have metadata.

Example homepage title:

```txt
แจ้งปัญหาชุมชน | Community Alert
```

Description:

```txt
แพลตฟอร์มแจ้งและติดตามปัญหาในชุมชน ช่วยให้ประชาชนและหน่วยงานในพื้นที่สามารถประสานงานและแก้ไขปัญหาได้อย่างมีประสิทธิภาพ
```

Report detail metadata should use the report title where reports are public.

---

# 56. Development Quality

Requirements:

* no `any` unless absolutely necessary
* no duplicated status labels
* centralized enums/constants
* reusable validation schemas
* reusable authorization functions
* reusable report query functions
* reusable status badge
* reusable filters
* clear naming
* clean TypeScript
* comments only when useful

Avoid overengineering.

Do not introduce:

* microservices
* event buses
* complex CQRS
* unnecessary repository patterns

This is a community service web application, not enterprise banking software.

---

# 57. First Implementation Milestone

Implement the project in this order:

### Phase 1

Set up:

* Next.js
* Tailwind
* shadcn/ui
* Base UI
* PostgreSQL
* Drizzle
* Better Auth

### Phase 2

Create:

* authentication
* users
* roles
* protected routes

### Phase 3

Create database:

* categories
* areas
* reports
* report images

### Phase 4

Implement resident workflow:

```txt
create report
my reports
report details
```

### Phase 5

Implement staff workflow:

```txt
staff report list
report detail
status updates
assignment
timeline
```

### Phase 6

Implement:

```txt
dashboard
charts
statistics
notifications
```

### Phase 7

Implement Admin management.

### Phase 8

Polish:

```txt
responsive
loading
error states
SEO
accessibility
seed data
```

---

# 58. MVP Priority

If development time is limited, prioritize:

1. Better Auth
2. Resident login/register
3. Report creation
4. Image upload
5. Location
6. Report status
7. Resident report tracking
8. Staff dashboard
9. Staff status management
10. Timeline

Features such as advanced notifications and complex analytics can come afterward.

---

# 59. Important UX Principle

Do not make the web application feel like a generic CRUD admin panel.

The user experience should emphasize the actual workflow:

```txt
พบปัญหา
↓
แจ้งปัญหา
↓
หน่วยงานรับเรื่อง
↓
ดำเนินการ
↓
แก้ไข
↓
ชุมชนดีขึ้น
```

Residents should always understand:

```txt
ตอนนี้เรื่องของฉันอยู่ขั้นตอนไหน?
ใครกำลังดูแล?
มีความคืบหน้าอะไร?
เรื่องนี้แก้ไขแล้วหรือยัง?
```

Staff should always understand:

```txt
เรื่องไหนต้องจัดการก่อน?
เรื่องไหนยังไม่มีคนรับผิดชอบ?
เรื่องไหนค้างมานาน?
วันนี้ต้องดำเนินการอะไร?
```

---

# 60. Final Requirement

Build this as a realistic application that could actually be introduced to a Thai community.

Prioritize:

```txt
simplicity
transparency
ease of use
mobile usability
fast reporting
clear progress tracking
```

Use polished Thai copy throughout the interface.

Do not fill pages with unnecessary text.

Do not create fake features that do not work.

All primary actions, database operations, permissions, status changes, filters, and dashboards must be functional.