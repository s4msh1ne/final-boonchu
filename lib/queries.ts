import "server-only";

import { and, asc, count, desc, eq, ilike, inArray, isNull, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  communityAreas,
  notifications,
  reportCategories,
  reports,
  systemSettings,
  user,
  type ReportPriority,
  type ReportStatus,
} from "@/db/schema";
import { PAGE_SIZE } from "@/lib/constants";

export async function getActiveFormOptions() {
  const [categories, areas] = await Promise.all([
    db.select().from(reportCategories).where(eq(reportCategories.isActive, true)).orderBy(asc(reportCategories.sortOrder)),
    db.select().from(communityAreas).where(eq(communityAreas.isActive, true)).orderBy(asc(communityAreas.name)),
  ]);
  return { categories, areas };
}

export async function getCommunitySettings() {
  const settings = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.id, "default"),
  });

  return settings ?? {
    id: "default",
    communityName: "เทศบาลเมืองสุพรรณบุรี",
    contactPhone: null,
    contactEmail: null,
    updatedAt: new Date(),
  };
}

export type ReportFilters = {
  page?: number;
  search?: string;
  status?: ReportStatus;
  category?: string;
  area?: string;
  priority?: ReportPriority;
  assignee?: string;
  sort?: "latest" | "oldest" | "updated";
};

export async function getReportList(filters: ReportFilters = {}, options: { publicOnly?: boolean; reporterId?: string } = {}) {
  const conditions: SQL[] = [];
  if (options.publicOnly) conditions.push(eq(reports.isPublic, true));
  if (options.reporterId) conditions.push(eq(reports.reporterId, options.reporterId));
  if (filters.search) {
    conditions.push(or(ilike(reports.title, `%${filters.search}%`), ilike(reports.reportNumber, `%${filters.search}%`))!);
  }
  if (filters.status) conditions.push(eq(reports.status, filters.status));
  if (filters.category) conditions.push(eq(reports.categoryId, filters.category));
  if (filters.area) conditions.push(eq(reports.areaId, filters.area));
  if (filters.priority) conditions.push(eq(reports.priority, filters.priority));
  if (filters.assignee === "unassigned") conditions.push(isNull(reports.assignedToId));
  else if (filters.assignee) conditions.push(eq(reports.assignedToId, filters.assignee));

  const where = conditions.length ? and(...conditions) : undefined;
  const page = Math.max(1, filters.page || 1);
  const order = filters.sort === "oldest"
    ? asc(reports.createdAt)
    : filters.sort === "updated"
      ? desc(reports.updatedAt)
      : desc(reports.createdAt);

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: reports.id,
        reportNumber: reports.reportNumber,
        title: reports.title,
        status: reports.status,
        priority: reports.priority,
        address: reports.address,
        createdAt: reports.createdAt,
        updatedAt: reports.updatedAt,
        categoryId: reports.categoryId,
        categoryName: reportCategories.name,
        areaId: reports.areaId,
        areaName: communityAreas.name,
        reporterName: user.name,
        assignedToId: reports.assignedToId,
        thumbnail: sql<string | null>`(
          select ${sql.identifier("url")} from ${sql.identifier("report_images")}
          where ${sql.identifier("report_id")} = ${reports.id}
          order by ${sql.identifier("order")} asc limit 1
        )`,
      })
      .from(reports)
      .innerJoin(reportCategories, eq(reports.categoryId, reportCategories.id))
      .leftJoin(communityAreas, eq(reports.areaId, communityAreas.id))
      .innerJoin(user, eq(reports.reporterId, user.id))
      .where(where)
      .orderBy(order)
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ value: count() }).from(reports).where(where),
  ]);
  return { items, total: totalResult[0].value, page, pageCount: Math.max(1, Math.ceil(totalResult[0].value / PAGE_SIZE)) };
}

export async function getReportDetail(id: string) {
  return db.query.reports.findFirst({
    where: eq(reports.id, id),
    with: {
      category: true,
      area: true,
      reporter: { columns: { id: true, name: true } },
      assignee: { columns: { id: true, name: true } },
      images: { orderBy: (images, { asc }) => [asc(images.order)] },
      updates: {
        orderBy: (updates, { asc }) => [asc(updates.createdAt)],
        with: { author: { columns: { name: true } } },
      },
      comments: {
        orderBy: (comments, { asc }) => [asc(comments.createdAt)],
        with: { author: { columns: { name: true, role: true } } },
      },
    },
  });
}

export async function getDashboardMetrics(
  reporterId?: string,
  options: { publicOnly?: boolean } = {},
) {
  const conditions: SQL[] = [];
  if (reporterId) conditions.push(eq(reports.reporterId, reporterId));
  if (options.publicOnly) conditions.push(eq(reports.isPublic, true));
  const where = conditions.length ? and(...conditions) : undefined;
  const [row] = await db
    .select({
      total: count(),
      pending: sql<number>`count(*) filter (where ${reports.status} = 'pending')::int`,
      acknowledged: sql<number>`count(*) filter (where ${reports.status} = 'acknowledged')::int`,
      working: sql<number>`count(*) filter (where ${reports.status} = 'in_progress')::int`,
      inProgress: sql<number>`count(*) filter (where ${reports.status} in ('acknowledged', 'in_progress'))::int`,
      resolved: sql<number>`count(*) filter (where ${reports.status} in ('resolved', 'closed'))::int`,
      rejected: sql<number>`count(*) filter (where ${reports.status} = 'rejected')::int`,
      urgent: sql<number>`count(*) filter (where ${reports.priority} = 'urgent')::int`,
      unassigned: sql<number>`count(*) filter (where ${reports.assignedToId} is null and ${reports.status} not in ('resolved', 'closed', 'rejected'))::int`,
      resolvedToday: sql<number>`count(*) filter (where ${reports.resolvedAt}::date = current_date)::int`,
      averageAcknowledgementHours: sql<number | null>`avg(extract(epoch from (${reports.acknowledgedAt} - ${reports.createdAt})) / 3600) filter (where ${reports.acknowledgedAt} is not null)::float`,
      averageHours: sql<number | null>`avg(extract(epoch from (${reports.resolvedAt} - ${reports.createdAt})) / 3600) filter (where ${reports.resolvedAt} is not null)::float`,
    })
    .from(reports)
    .where(where);
  return row;
}

export async function getStaffChartData() {
  const [byStatus, byCategory, overTime] = await Promise.all([
    db.select({ name: reports.status, value: count() }).from(reports).groupBy(reports.status),
    db.select({ name: reportCategories.name, value: count() }).from(reports).innerJoin(reportCategories, eq(reports.categoryId, reportCategories.id)).groupBy(reportCategories.name).orderBy(desc(count())).limit(6),
    db.select({ date: sql<string>`to_char(${reports.createdAt}::date, 'DD/MM')`, value: count() }).from(reports).where(sql`${reports.createdAt} >= current_date - interval '6 days'`).groupBy(sql`${reports.createdAt}::date`).orderBy(sql`${reports.createdAt}::date`),
  ]);
  return { byStatus, byCategory, overTime };
}

export async function getStaffUsers() {
  return db.select({ id: user.id, name: user.name }).from(user).where(inArray(user.role, ["staff", "admin"])).orderBy(asc(user.name));
}

export async function getUserNotifications(userId: string, limit = 6) {
  const [items, unread] = await Promise.all([
    db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit),
    db.select({ value: count() }).from(notifications).where(and(eq(notifications.userId, userId), isNull(notifications.readAt))),
  ]);
  return { items, unread: unread[0].value };
}
