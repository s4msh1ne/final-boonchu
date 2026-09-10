import { format, formatDistanceToNowStrict, isYesterday } from "date-fns";
import { th } from "date-fns/locale";

function buddhistYear(date: Date, pattern: string) {
  return format(date, pattern, { locale: th }).replace(
    String(date.getFullYear()),
    String(date.getFullYear() + 543),
  );
}

export function formatThaiDate(value: Date | string) {
  return buddhistYear(new Date(value), "d MMMM yyyy");
}

export function formatThaiDateTime(value: Date | string) {
  return `${buddhistYear(new Date(value), "d MMMM yyyy")} เวลา ${format(new Date(value), "HH:mm")} น.`;
}

export function formatThaiRelative(value: Date | string) {
  const date = new Date(value);
  if (isYesterday(date)) return "เมื่อวาน";
  return `${formatDistanceToNowStrict(date, { locale: th })}ที่แล้ว`;
}
