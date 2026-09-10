import type { ReportPriority, ReportStatus, UserRole } from "@/db/schema";

export const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "รอตรวจสอบ",
  acknowledged: "รับเรื่องแล้ว",
  in_progress: "กำลังดำเนินการ",
  resolved: "แก้ไขแล้ว",
  closed: "ปิดเรื่อง",
  rejected: "ไม่รับเรื่อง",
};

export const PRIORITY_LABELS: Record<ReportPriority, string> = {
  low: "ต่ำ",
  normal: "ปกติ",
  high: "สูง",
  urgent: "เร่งด่วน",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  resident: "สมาชิกชุมชน",
  staff: "เจ้าหน้าที่",
  admin: "ผู้ดูแลระบบ",
};

export const STATUS_FLOW: ReportStatus[] = [
  "pending",
  "acknowledged",
  "in_progress",
  "resolved",
  "closed",
];

export const DEFAULT_CATEGORIES = [
  ["ไฟถนน / ไฟสาธารณะ", "bulb"],
  ["ถนนและทางเท้า", "road"],
  ["ขยะและสิ่งปฏิกูล", "trash"],
  ["น้ำประปา", "droplet"],
  ["ท่อระบายน้ำ", "waves"],
  ["น้ำท่วม", "flood"],
  ["ต้นไม้ / กิ่งไม้", "tree"],
  ["พื้นที่อันตราย", "alert-triangle"],
  ["สัตว์จรจัด", "paw"],
  ["มลพิษ / กลิ่น / เสียง", "wind"],
  ["ทรัพย์สินสาธารณะ", "building"],
  ["เหตุฉุกเฉินในชุมชน", "siren"],
  ["อื่น ๆ", "dots"],
] as const;

export const PAGE_SIZE = 12;
export const MAX_REPORT_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
