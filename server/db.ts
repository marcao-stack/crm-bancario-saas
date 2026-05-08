import { eq, desc, and, like, between } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  clients,
  proposals,
  banks,
  bankProducts,
  clientInteractions,
  auditLogs,
  notifications,
  authorizationLinks,
  proposalHistory,
  workflows
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ CLIENTS ============

export async function getClients(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).limit(limit).offset(offset);
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0];
}

export async function createClient(data: typeof clients.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(clients).values(data);
  return result;
}

export async function updateClient(id: number, data: Partial<typeof clients.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(clients).set(data).where(eq(clients.id, id));
}

// ============ PROPOSALS ============

export async function getProposals(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proposals).orderBy(desc(proposals.createdAt)).limit(limit).offset(offset);
}

export async function getProposalById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
  return result[0];
}

export async function getProposalsByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proposals).where(eq(proposals.status, status as any));
}

export async function createProposal(data: typeof proposals.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(proposals).values(data);
}

export async function updateProposal(id: number, data: Partial<typeof proposals.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(proposals).set(data).where(eq(proposals.id, id));
}

// ============ BANKS ============

export async function getBanks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(banks).orderBy(banks.name);
}

export async function getBankById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(banks).where(eq(banks.id, id)).limit(1);
  return result[0];
}

export async function createBank(data: typeof banks.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(banks).values(data);
}

// ============ BANK PRODUCTS ============

export async function getBankProducts(bankId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bankProducts).where(eq(bankProducts.bankId, bankId));
}

export async function createBankProduct(data: typeof bankProducts.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(bankProducts).values(data);
}

// ============ INTERACTIONS ============

export async function getClientInteractions(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clientInteractions)
    .where(eq(clientInteractions.clientId, clientId))
    .orderBy(desc(clientInteractions.createdAt));
}

export async function createClientInteraction(data: typeof clientInteractions.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(clientInteractions).values(data);
}

// ============ AUDIT LOGS ============

export async function createAuditLog(data: typeof auditLogs.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(auditLogs).values(data);
}

export async function getAuditLogs(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit)
    .offset(offset);
}

// ============ NOTIFICATIONS ============

export async function createNotification(data: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(notifications).values(data);
}

export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

// ============ AUTHORIZATION LINKS ============

export async function createAuthorizationLink(data: typeof authorizationLinks.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(authorizationLinks).values(data);
}

export async function getAuthorizationLinkByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(authorizationLinks)
    .where(eq(authorizationLinks.token, token))
    .limit(1);
  return result[0];
}

export async function updateAuthorizationLink(id: number, data: Partial<typeof authorizationLinks.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(authorizationLinks).set(data).where(eq(authorizationLinks.id, id));
}

// ============ PROPOSAL HISTORY ============

export async function getProposalHistory(proposalId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proposalHistory)
    .where(eq(proposalHistory.proposalId, proposalId))
    .orderBy(desc(proposalHistory.createdAt));
}

export async function createProposalHistory(data: typeof proposalHistory.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(proposalHistory).values(data);
}

// ============ WORKFLOWS ============

export async function getWorkflows() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workflows).where(eq(workflows.isActive, true));
}

export async function createWorkflow(data: typeof workflows.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(workflows).values(data);
}
