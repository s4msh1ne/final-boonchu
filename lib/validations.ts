import { z } from "zod";
import {
  reportPriorities,
  reportStatuses,
  userRoles,
} from "@/db/schema";

export const reportSchema = z.object({
  categoryId: z.string().uuid("กรุณาเลือกประเภทปัญหา"),
  title: z.string().trim().min(5, "หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร").max(150),
  description: z
    .string()
    .trim()
    .min(10, "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร")
    .max(3000),
  residentUrgency: z.enum(reportPriorities).default("normal"),
  areaId: z.union([z.string().uuid(), z.literal("")]).optional(),
  address: z.string().trim().min(3, "กรุณาระบุที่อยู่").max(500),
  landmark: z.string().trim().max(300).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  isPublic: z.preprocess((value) => value === "on" || value === true, z.boolean()),
});

export const commentSchema = z.object({
  reportId: z.string().uuid(),
  message: z.string().trim().min(2, "กรุณาระบุข้อความ").max(1000),
});

export const staffUpdateSchema = z.object({
  reportId: z.string().uuid(),
  status: z.enum(reportStatuses),
  priority: z.enum(reportPriorities),
  assignedToId: z.union([z.string().min(1), z.literal("")]),
  message: z.string().trim().max(1000).optional(),
  rejectionReason: z.string().trim().max(1000).optional(),
}).superRefine((value, ctx) => {
  if (value.status === "rejected" && (!value.rejectionReason || value.rejectionReason.length < 5)) {
    ctx.addIssue({
      code: "custom",
      path: ["rejectionReason"],
      message: "กรุณาระบุเหตุผลที่ปฏิเสธอย่างน้อย 5 ตัวอักษร",
    });
  }
});

export const categorySchema = z.object({
  id: z.union([z.string().uuid(), z.literal("")]).optional(),
  name: z.string().trim().min(2, "กรุณาระบุชื่อประเภท").max(100),
  icon: z.string().trim().min(1).max(50),
  sortOrder: z.coerce.number().int().min(0).max(999),
  isActive: z.preprocess((value) => value === "on" || value === true, z.boolean()),
});

export const areaSchema = z.object({
  id: z.union([z.string().uuid(), z.literal("")]).optional(),
  name: z.string().trim().min(2, "กรุณาระบุชื่อพื้นที่").max(100),
  description: z.string().trim().max(500).optional(),
  isActive: z.preprocess((value) => value === "on" || value === true, z.boolean()),
});

export const roleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(userRoles),
});

export const settingsSchema = z.object({
  communityName: z.string().trim().min(2).max(150),
  contactPhone: z.string().trim().max(30).optional(),
  contactEmail: z.union([z.string().trim().email(), z.literal("")]).optional(),
});
