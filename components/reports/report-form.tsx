"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  IconCamera,
  IconFileDescription,
  IconLoader2,
  IconMapPin,
  IconPhotoPlus,
  IconX,
} from "@tabler/icons-react";
import { createReportAction } from "@/actions/reports";
import type { communityAreas, reportCategories } from "@/db/schema";
import { MAX_REPORT_IMAGES } from "@/lib/constants";
import { ReportMap } from "@/components/reports/report-map";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormFields = {
  categoryId: string;
  residentUrgency: string;
  areaId: string;
  title: string;
  description: string;
  address: string;
  landmark: string;
};

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof IconFileDescription;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="font-heading text-base font-semibold">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function ReportForm({
  categories,
  areas,
}: {
  categories: (typeof reportCategories.$inferSelect)[];
  areas: (typeof communityAreas.$inferSelect)[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<{ file: File; url: string }[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      categoryId: "",
      residentUrgency: "normal",
      areaId: "",
    },
  });

  const submit = handleSubmit((_values, event) => {
    const form = event?.currentTarget as HTMLFormElement | undefined;
    if (!form) return;
    const formData = new FormData(form);
    formData.delete("images");
    files.forEach(({ file }) => formData.append("images", file));

    startTransition(async () => {
      const result = await createReportAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push(
        `/report/success?id=${result.data.id}&number=${encodeURIComponent(result.data.reportNumber)}`,
      );
    });
  });

  const selectFiles = (selected: FileList | null) => {
    if (!selected) return;
    const next = Array.from(selected)
      .slice(0, MAX_REPORT_IMAGES - files.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setFiles((current) => [...current, ...next]);
  };

  return (
    <form onSubmit={submit} noValidate>
      <Card className="gap-0 py-0">
        <section className="space-y-6 border-b p-5 sm:p-7">
          <SectionHeading
            icon={IconFileDescription}
            title="รายละเอียดปัญหา"
            description="บอกให้เราทราบว่าพบปัญหาอะไร"
          />
          <div className="grid gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="categoryId">
                ประเภทปัญหา <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "กรุณาเลือกประเภทปัญหา" }}
                render={({ field }) => (
                  <Select
                    name="categoryId"
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? "")}
                  >
                    <SelectTrigger
                      id="categoryId"
                      className="h-11 w-full"
                      aria-invalid={Boolean(errors.categoryId)}
                    >
                      <SelectValue placeholder="เลือกประเภทปัญหา" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
              {categories.length === 0 && (
                <p className="text-xs text-destructive">
                  ยังไม่มีประเภทปัญหาที่เปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title">
                หัวข้อปัญหา <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                className="h-11"
                placeholder="ไฟถนนบริเวณหน้าซอยไม่ติด"
                {...register("title", {
                  required: "กรุณาระบุหัวข้อ",
                  minLength: {
                    value: 5,
                    message: "หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร",
                  },
                  maxLength: 150,
                })}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">
                รายละเอียด <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                className="min-h-32"
                placeholder="อธิบายปัญหาที่พบเพิ่มเติม เพื่อช่วยให้เจ้าหน้าที่ตรวจสอบได้ง่ายขึ้น"
                {...register("description", {
                  required: "กรุณาระบุรายละเอียด",
                  minLength: {
                    value: 10,
                    message: "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร",
                  },
                  maxLength: 3000,
                })}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="residentUrgency">
                ความเร่งด่วนที่ผู้แจ้งประเมิน
              </Label>
              <Controller
                name="residentUrgency"
                control={control}
                render={({ field }) => (
                  <Select
                    name="residentUrgency"
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(value ?? "normal")
                    }
                  >
                    <SelectTrigger id="residentUrgency" className="h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">ต่ำ</SelectItem>
                      <SelectItem value="normal">ปกติ</SelectItem>
                      <SelectItem value="high">สูง</SelectItem>
                      <SelectItem value="urgent">เร่งด่วน</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                เจ้าหน้าที่จะเป็นผู้กำหนดความสำคัญอย่างเป็นทางการ
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-5 border-b p-5 sm:p-7">
          <SectionHeading
            icon={IconCamera}
            title="รูปภาพ"
            description="ภาพที่ชัดเจนช่วยให้ตรวจสอบได้เร็วขึ้น"
          />
          <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 p-5 text-center transition-colors hover:bg-muted">
            <IconPhotoPlus className="mb-2 size-8 text-primary" />
            <span className="font-medium">เพิ่มรูปภาพปัญหา</span>
            <span className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WEBP ไม่เกิน 5 MB ต่อรูป สูงสุด 5 รูป
            </span>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => selectFiles(event.target.files)}
              disabled={files.length >= MAX_REPORT_IMAGES}
            />
          </label>
          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {files.map((item, index) => (
                <div
                  key={item.url}
                  className="relative aspect-square overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={item.url}
                    alt={`ภาพตัวอย่าง ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    aria-label={`ลบภาพที่ ${index + 1}`}
                    onClick={() => {
                      URL.revokeObjectURL(item.url);
                      setFiles(files.filter((_, itemIndex) => itemIndex !== index));
                    }}
                    className="absolute right-1 top-1 rounded-full"
                  >
                    <IconX className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6 border-b p-5 sm:p-7">
          <SectionHeading
            icon={IconMapPin}
            title="ตำแหน่งที่เกิดปัญหา"
            description="ใช้ตำแหน่งปัจจุบันหรือปักหมุดบนแผนที่"
          />
          <ReportMap
            latitude={location?.latitude}
            longitude={location?.longitude}
            onChange={setLocation}
          />
          <input type="hidden" name="latitude" value={location?.latitude ?? ""} />
          <input type="hidden" name="longitude" value={location?.longitude ?? ""} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">
                ที่อยู่ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                className="h-11"
                placeholder="บ้านเลขที่ ซอย ถนน"
                {...register("address", {
                  required: "กรุณาระบุที่อยู่",
                  minLength: 3,
                })}
              />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="areaId">พื้นที่ชุมชน</Label>
              <Controller
                name="areaId"
                control={control}
                render={({ field }) => (
                  <Select
                    name="areaId"
                    value={field.value || null}
                    onValueChange={(value) => field.onChange(value ?? "")}
                  >
                    <SelectTrigger id="areaId" className="h-11 w-full">
                      <SelectValue placeholder="ไม่ระบุพื้นที่" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {areas.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  ยังไม่มีพื้นที่ชุมชนที่เปิดใช้งาน
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="landmark">จุดสังเกต</Label>
              <Input
                id="landmark"
                className="h-11"
                placeholder="ใกล้ศาลาชุมชน"
                {...register("landmark")}
              />
            </div>
          </div>
        </section>

        <section className="space-y-5 p-5 sm:p-7">
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox name="isPublic" defaultChecked className="mt-0.5" />
            <span>
              <span className="block font-medium">
                อนุญาตให้แสดงรายงานนี้ต่อสาธารณะ
              </span>
              <span className="text-xs text-muted-foreground">
                ข้อมูลส่วนตัว เช่น อีเมลและเบอร์โทร จะไม่ถูกเปิดเผย
              </span>
            </span>
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="h-12 w-full text-base"
            disabled={isPending || categories.length === 0}
          >
            {isPending && <IconLoader2 className="animate-spin" />}
            {isPending ? "กำลังส่งรายงาน..." : "ส่งรายงาน"}
          </Button>
        </section>
      </Card>
    </form>
  );
}
