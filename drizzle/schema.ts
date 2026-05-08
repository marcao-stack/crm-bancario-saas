import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  boolean,
  datetime,
  json,
  index,
  foreignKey,
  unique
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role hierarchy for CRM system.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  // Role hierarchy: admin > manager > consultant > operator
  role: mysqlEnum("role", ["admin", "manager", "consultant", "operator"]).default("operator").notNull(),
  departmentId: int("departmentId"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  roleIdx: index("role_idx").on(table.role),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Departments for organizational structure
 */
export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  managerId: int("managerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

/**
 * Clients/Customers database
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 20 }).unique(),
  rg: varchar("rg", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  dateOfBirth: datetime("dateOfBirth"),
  maritalStatus: mysqlEnum("maritalStatus", ["single", "married", "divorced", "widowed", "other"]),
  monthlyIncome: decimal("monthlyIncome", { precision: 12, scale: 2 }),
  creditScore: int("creditScore"),
  status: mysqlEnum("status", ["active", "inactive", "blocked", "prospect"]).default("prospect").notNull(),
  tags: json("tags").$type<string[]>(),
  notes: text("notes"),
  consultantId: int("consultantId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  cpfCnpjIdx: index("cpfCnpj_idx").on(table.cpfCnpj),
  emailIdx: index("email_idx").on(table.email),
  consultantIdx: index("consultant_idx").on(table.consultantId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Client interaction timeline
 */
export const clientInteractions = mysqlTable("clientInteractions", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  type: mysqlEnum("type", ["call", "email", "meeting", "proposal", "document", "note"]).notNull(),
  description: text("description").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  clientIdx: index("client_idx").on(table.clientId),
  userIdx: index("user_idx").on(table.userId),
}));

export type ClientInteraction = typeof clientInteractions.$inferSelect;
export type InsertClientInteraction = typeof clientInteractions.$inferInsert;

/**
 * Client documents
 */
export const clientDocuments = mysqlTable("clientDocuments", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  documentType: varchar("documentType", { length: 100 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize"),
  uploadedBy: int("uploadedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  clientIdx: index("client_idx").on(table.clientId),
}));

export type ClientDocument = typeof clientDocuments.$inferSelect;
export type InsertClientDocument = typeof clientDocuments.$inferInsert;

/**
 * Partner banks
 */
export const banks = mysqlTable("banks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  code: varchar("code", { length: 10 }).unique(),
  logoUrl: text("logoUrl"),
  status: mysqlEnum("status", ["active", "inactive", "maintenance"]).default("active").notNull(),
  integrationType: mysqlEnum("integrationType", ["api", "webhook", "csv", "manual"]).default("manual").notNull(),
  slaHours: int("slaHours"),
  approvalRate: decimal("approvalRate", { precision: 5, scale: 2 }),
  description: text("description"),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusIdx: index("status_idx").on(table.status),
}));

export type Bank = typeof banks.$inferSelect;
export type InsertBank = typeof banks.$inferInsert;

/**
 * Bank products
 */
export const bankProducts = mysqlTable("bankProducts", {
  id: int("id").autoincrement().primaryKey(),
  bankId: int("bankId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  minAmount: decimal("minAmount", { precision: 12, scale: 2 }),
  maxAmount: decimal("maxAmount", { precision: 12, scale: 2 }),
  interestRate: decimal("interestRate", { precision: 5, scale: 2 }),
  termMonths: int("termMonths"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  bankIdx: index("bank_idx").on(table.bankId),
}));

export type BankProduct = typeof bankProducts.$inferSelect;
export type InsertBankProduct = typeof bankProducts.$inferInsert;

/**
 * Proposals - Core entity for credit/financial proposals
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  proposalNumber: varchar("proposalNumber", { length: 50 }).unique().notNull(),
  clientId: int("clientId").notNull(),
  bankId: int("bankId").notNull(),
  productId: int("productId"),
  consultantId: int("consultantId").notNull(),
  status: mysqlEnum("status", ["draft", "analysis", "approved", "rejected", "contracted"]).default("draft").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  termMonths: int("termMonths"),
  interestRate: decimal("interestRate", { precision: 5, scale: 2 }),
  monthlyPayment: decimal("monthlyPayment", { precision: 12, scale: 2 }),
  approvalDate: datetime("approvalDate"),
  rejectionReason: text("rejectionReason"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdx: index("client_idx").on(table.clientId),
  bankIdx: index("bank_idx").on(table.bankId),
  consultantIdx: index("consultant_idx").on(table.consultantId),
  statusIdx: index("status_idx").on(table.status),
  proposalNumberIdx: index("proposalNumber_idx").on(table.proposalNumber),
}));

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * Proposal status history for tracking movements
 */
export const proposalHistory = mysqlTable("proposalHistory", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull(),
  previousStatus: mysqlEnum("previousStatus", ["draft", "analysis", "approved", "rejected", "contracted"]),
  newStatus: mysqlEnum("newStatus", ["draft", "analysis", "approved", "rejected", "contracted"]).notNull(),
  changedBy: int("changedBy").notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  proposalIdx: index("proposal_idx").on(table.proposalId),
}));

export type ProposalHistory = typeof proposalHistory.$inferSelect;
export type InsertProposalHistory = typeof proposalHistory.$inferInsert;

/**
 * Workflow rules and automation
 */
export const workflows = mysqlTable("workflows", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trigger: mysqlEnum("trigger", ["status_change", "amount_threshold", "score_threshold", "time_based"]).notNull(),
  triggerValue: text("triggerValue"),
  action: mysqlEnum("action", ["auto_approve", "auto_reject", "send_notification", "create_task", "escalate"]).notNull(),
  actionValue: text("actionValue"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;

/**
 * Digital authorization links for remote signing
 */
export const authorizationLinks = mysqlTable("authorizationLinks", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: datetime("expiresAt").notNull(),
  isUsed: boolean("isUsed").default(false).notNull(),
  usedAt: datetime("usedAt"),
  clientIpAddress: varchar("clientIpAddress", { length: 45 }),
  securityHash: varchar("securityHash", { length: 255 }),
  signatureData: json("signatureData").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  proposalIdx: index("proposal_idx").on(table.proposalId),
  tokenIdx: index("token_idx").on(table.token),
  expiresAtIdx: index("expiresAt_idx").on(table.expiresAt),
}));

export type AuthorizationLink = typeof authorizationLinks.$inferSelect;
export type InsertAuthorizationLink = typeof authorizationLinks.$inferInsert;

/**
 * Notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["info", "warning", "error", "success"]).default("info").notNull(),
  relatedEntityType: varchar("relatedEntityType", { length: 50 }),
  relatedEntityId: int("relatedEntityId"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  isReadIdx: index("isRead_idx").on(table.isRead),
}));

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Audit logs for compliance and tracking
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId"),
  oldValue: json("oldValue").$type<Record<string, unknown>>(),
  newValue: json("newValue").$type<Record<string, unknown>>(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  entityIdx: index("entity_idx").on(table.entityType),
  createdAtIdx: index("createdAt_idx").on(table.createdAt),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Reports configuration
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["financial", "operational", "conversion", "performance"]).notNull(),
  filters: json("filters").$type<Record<string, unknown>>(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
