import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { createHash } from "crypto";

// ============ ROLE-BASED PROCEDURES ============

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const managerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!["admin", "manager"].includes(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Manager access required" });
  }
  return next({ ctx });
});

// ============ AUDIT LOG HELPER ============

async function logAuditAction(
  userId: number,
  action: string,
  entityType: string,
  entityId?: number,
  oldValue?: Record<string, unknown>,
  newValue?: Record<string, unknown>
) {
  await db.createAuditLog({
    userId,
    action,
    entityType,
    entityId,
    oldValue,
    newValue,
    ipAddress: undefined,
    userAgent: undefined,
  });
}

// ============ ROUTERS ============

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ CLIENTS ============

  clients: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return db.getClients(input.limit, input.offset);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getClientById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        fullName: z.string(),
        cpfCnpj: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        whatsapp: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        monthlyIncome: z.string().optional(),
        creditScore: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createClient({
          fullName: input.fullName,
          cpfCnpj: input.cpfCnpj,
          email: input.email,
          phone: input.phone,
          whatsapp: input.whatsapp,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          monthlyIncome: input.monthlyIncome ? parseFloat(input.monthlyIncome).toString() as any : undefined,
          creditScore: input.creditScore,
          notes: input.notes,
          consultantId: ctx.user.id,
          status: "prospect",
        });

        await logAuditAction(ctx.user.id, "CREATE", "CLIENT", undefined, undefined, { fullName: input.fullName });
        return result;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        fullName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        status: z.enum(["active", "inactive", "blocked", "prospect"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const oldData = await db.getClientById(input.id);
        const result = await db.updateClient(input.id, {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          status: input.status,
          notes: input.notes,
        });

        await logAuditAction(ctx.user.id, "UPDATE", "CLIENT", input.id, oldData, { ...input });
        return result;
      }),
  }),

  // ============ PROPOSALS ============

  proposals: router({
    list: protectedProcedure
      .input(z.object({ 
        limit: z.number().default(50), 
        offset: z.number().default(0),
        status: z.string().optional(),
      }))
      .query(async ({ input }) => {
        if (input.status) {
          return db.getProposalsByStatus(input.status);
        }
        return db.getProposals(input.limit, input.offset);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const proposal = await db.getProposalById(input.id);
        const history = proposal ? await db.getProposalHistory(input.id) : [];
        return { proposal, history };
      }),

    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        bankId: z.number(),
        productId: z.number().optional(),
        amount: z.string(),
        termMonths: z.number().optional(),
        interestRate: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const proposalNumber = `PROP-${Date.now()}-${nanoid(8)}`;
        
        const result = await db.createProposal({
          proposalNumber,
          clientId: input.clientId,
          bankId: input.bankId,
          productId: input.productId,
          consultantId: ctx.user.id,
          amount: parseFloat(input.amount).toString() as any,
          termMonths: input.termMonths,
          interestRate: input.interestRate ? parseFloat(input.interestRate).toString() as any : undefined,
          notes: input.notes,
          status: "draft",
        });

        await logAuditAction(ctx.user.id, "CREATE", "PROPOSAL", undefined, undefined, { proposalNumber });
        
        // Create initial history entry
        // History will be created when status is updated

        return result;
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        newStatus: z.enum(["draft", "analysis", "approved", "rejected", "contracted"]),
        reason: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const proposal = await db.getProposalById(input.id);
        if (!proposal) throw new TRPCError({ code: "NOT_FOUND" });

        // Check permissions based on role
        if (ctx.user.role === "consultant" && proposal.consultantId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateProposal(input.id, { status: input.newStatus });
        
        await db.createProposalHistory({
          proposalId: input.id,
          previousStatus: proposal.status as any,
          newStatus: input.newStatus,
          changedBy: ctx.user.id,
          reason: input.reason || undefined,
        });

        await logAuditAction(ctx.user.id, "UPDATE_STATUS", "PROPOSAL", input.id, 
          { status: proposal.status }, { status: input.newStatus });

        // Create notification
        const client = await db.getClientById(proposal.clientId);
        if (client) {
          await db.createNotification({
            userId: proposal.consultantId,
            title: "Proposta Atualizada",
            message: `Proposta ${proposal.proposalNumber} foi movida para ${input.newStatus}`,
            type: "info",
            relatedEntityType: "PROPOSAL",
            relatedEntityId: input.id,
          });
        }

        return { success: true };
      }),
  }),

  // ============ BANKS ============

  banks: router({
    list: protectedProcedure.query(async () => {
      return db.getBanks();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const bank = await db.getBankById(input.id);
        const products = bank ? await db.getBankProducts(input.id) : [];
        return { bank, products };
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        code: z.string(),
        description: z.string().optional(),
        slaHours: z.number().optional(),
        approvalRate: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createBank({
          name: input.name,
          code: input.code,
          description: input.description,
          slaHours: input.slaHours,
          approvalRate: input.approvalRate ? parseFloat(input.approvalRate).toString() as any : undefined,
          status: "active",
          integrationType: "manual",
        });

        await logAuditAction(ctx.user.id, "CREATE", "BANK", undefined, undefined, { name: input.name });
        return result;
      }),
  }),

  // ============ NOTIFICATIONS ============

  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserNotifications(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.markNotificationAsRead(input.id);
      }),
  }),

  // ============ AUTHORIZATION LINKS ============

  authorizationLinks: router({
    generate: protectedProcedure
      .input(z.object({
        proposalId: z.number(),
        expirationHours: z.number().default(72),
      }))
      .mutation(async ({ input, ctx }) => {
        const proposal = await db.getProposalById(input.proposalId);
        if (!proposal) throw new TRPCError({ code: "NOT_FOUND" });

        const token = nanoid(32);
        const expiresAt = new Date(Date.now() + input.expirationHours * 60 * 60 * 1000);
        const securityHash = createHash("sha256").update(token + Date.now()).digest("hex");

        const result = await db.createAuthorizationLink({
          proposalId: input.proposalId,
          token,
          expiresAt,
          securityHash,
        });

        await logAuditAction(ctx.user.id, "CREATE", "AUTHORIZATION_LINK", input.proposalId);

        return { token, expiresAt, securityHash };
      }),

    validate: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const link = await db.getAuthorizationLinkByToken(input.token);
        if (!link) throw new TRPCError({ code: "NOT_FOUND" });

        if (link.isUsed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Link já foi utilizado" });
        }

        if (new Date() > link.expiresAt) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Link expirado" });
        }

        const proposal = await db.getProposalById(link.proposalId);
        const client = proposal ? await db.getClientById(proposal.clientId) : null;

        return { proposal, client, link };
      }),

    sign: publicProcedure
      .input(z.object({
        token: z.string(),
        signatureData: z.record(z.string(), z.unknown()),
        clientIpAddress: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const link = await db.getAuthorizationLinkByToken(input.token);
        if (!link) throw new TRPCError({ code: "NOT_FOUND" });

        if (link.isUsed || new Date() > link.expiresAt) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Link inválido ou expirado" });
        }

        await db.updateAuthorizationLink(link.id, {
          isUsed: true,
          usedAt: new Date(),
          signatureData: input.signatureData,
          clientIpAddress: input.clientIpAddress,
        });

        const proposal = await db.getProposalById(link.proposalId);
        if (proposal) {
          await db.updateProposal(link.proposalId, { status: "contracted" });
        await db.createProposalHistory({
          proposalId: link.proposalId,
          previousStatus: proposal.status as any,
          newStatus: "contracted",
          changedBy: proposal.consultantId,
          reason: "Assinado digitalmente",
        });
        }

        return { success: true };
      }),
  }),

  // ============ AUDIT LOGS ============

  auditLogs: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return db.getAuditLogs(input.limit, input.offset);
      }),
  }),
});

export type AppRouter = typeof appRouter;
