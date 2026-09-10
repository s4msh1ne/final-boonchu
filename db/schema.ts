import { relations, sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgSequence,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoles = ["resident", "staff", "admin"] as const;
export const reportStatuses = [
  "pending",
  "acknowledged",
  "in_progress",
  "resolved",
  "closed",
  "rejected",
] as const;
export const reportPriorities = ["low", "normal", "high", "urgent"] as const;
export const reportUpdateTypes = [
  "status_change",
  "comment",
  "assignment",
  "system",
] as const;

export const userRoleEnum = pgEnum("user_role", userRoles);
export const reportStatusEnum = pgEnum("report_status", reportStatuses);
export const reportPriorityEnum = pgEnum("report_priority", reportPriorities);
export const reportUpdateTypeEnum = pgEnum(
  "report_update_type",
  reportUpdateTypes,
);
export const reportNumberSequence = pgSequence("report_number_sequence");

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("resident").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const reportCategories = pgTable(
  "report_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    icon: text("icon").default("alert-circle").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("report_categories_name_idx").on(table.name)],
);

export const communityAreas = pgTable(
  "community_areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("community_areas_name_idx").on(table.name)],
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportNumber: text("report_number")
      .default(
        sql`'REP-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('report_number_sequence')::text, 6, '0')`,
      )
      .notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: reportStatusEnum("status").default("pending").notNull(),
    priority: reportPriorityEnum("priority").default("normal").notNull(),
    residentUrgency: reportPriorityEnum("resident_urgency").default("normal").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => reportCategories.id),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => user.id),
    assignedToId: text("assigned_to_id").references(() => user.id),
    areaId: uuid("area_id").references(() => communityAreas.id),
    address: text("address").notNull(),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    landmark: text("landmark"),
    isPublic: boolean("is_public").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("reports_report_number_idx").on(table.reportNumber),
    index("reports_status_idx").on(table.status),
    index("reports_priority_idx").on(table.priority),
    index("reports_category_id_idx").on(table.categoryId),
    index("reports_reporter_id_idx").on(table.reporterId),
    index("reports_assigned_to_id_idx").on(table.assignedToId),
    index("reports_area_id_idx").on(table.areaId),
    index("reports_created_at_idx").on(table.createdAt),
  ],
);

export const reportImages = pgTable(
  "report_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    objectKey: text("object_key").notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("report_images_report_id_idx").on(table.reportId)],
);

export const reportUpdates = pgTable(
  "report_updates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    authorId: text("author_id").references(() => user.id),
    type: reportUpdateTypeEnum("type").notNull(),
    message: text("message").notNull(),
    oldStatus: reportStatusEnum("old_status"),
    newStatus: reportStatusEnum("new_status"),
    isPublic: boolean("is_public").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("report_updates_report_id_idx").on(table.reportId),
    index("report_updates_created_at_idx").on(table.createdAt),
  ],
);

export const reportComments = pgTable(
  "report_comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id),
    message: text("message").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("report_comments_report_id_idx").on(table.reportId)],
);

export const reportAssignments = pgTable(
  "report_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    assignedToId: text("assigned_to_id")
      .notNull()
      .references(() => user.id),
    assignedById: text("assigned_by_id")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("report_assignments_report_id_idx").on(table.reportId)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, string>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_read_at_idx").on(table.readAt),
  ],
);

export const systemSettings = pgTable("system_settings", {
  id: text("id").primaryKey().default("default"),
  communityName: text("community_name")
    .default("เทศบาลเมืองสุพรรณบุรี")
    .notNull(),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  reports: many(reports, { relationName: "reporter" }),
  assignedReports: many(reports, { relationName: "assignee" }),
  comments: many(reportComments),
  notifications: many(notifications),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const reportRelations = relations(reports, ({ one, many }) => ({
  category: one(reportCategories, {
    fields: [reports.categoryId],
    references: [reportCategories.id],
  }),
  area: one(communityAreas, {
    fields: [reports.areaId],
    references: [communityAreas.id],
  }),
  reporter: one(user, {
    relationName: "reporter",
    fields: [reports.reporterId],
    references: [user.id],
  }),
  assignee: one(user, {
    relationName: "assignee",
    fields: [reports.assignedToId],
    references: [user.id],
  }),
  images: many(reportImages),
  updates: many(reportUpdates),
  comments: many(reportComments),
  assignments: many(reportAssignments),
}));

export const categoryRelations = relations(reportCategories, ({ many }) => ({
  reports: many(reports),
}));

export const areaRelations = relations(communityAreas, ({ many }) => ({
  reports: many(reports),
}));

export const imageRelations = relations(reportImages, ({ one }) => ({
  report: one(reports, { fields: [reportImages.reportId], references: [reports.id] }),
}));

export const updateRelations = relations(reportUpdates, ({ one }) => ({
  report: one(reports, { fields: [reportUpdates.reportId], references: [reports.id] }),
  author: one(user, { fields: [reportUpdates.authorId], references: [user.id] }),
}));

export const commentRelations = relations(reportComments, ({ one }) => ({
  report: one(reports, { fields: [reportComments.reportId], references: [reports.id] }),
  author: one(user, { fields: [reportComments.authorId], references: [user.id] }),
}));

export type UserRole = (typeof userRoles)[number];
export type ReportStatus = (typeof reportStatuses)[number];
export type ReportPriority = (typeof reportPriorities)[number];
