import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().min(1).optional() }))
    .mutation(async ({ ctx, input }) => {
       await ctx.db.insert(todos).values({
        name: input.name,
        description: input.description,
        createdById: ctx.session.user.id,
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.todos.findMany({
      where: eq(todos.createdById, ctx.session.user.id),
      orderBy: (todos, { desc }) => [desc(todos.createdAt)],
    });

    return result;
  }),

  remove: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(todos).where(eq(todos.id, input.id));
  }
  ),

  update: protectedProcedure.input(z.object({ id: z.number(), done: z.boolean().optional(), name: z.string().min(1).optional(), description: z.string().min(1).optional()  })).mutation(async ({ ctx, input }) => {
    await ctx.db.update(todos).set(input).where(eq(todos.id, input.id));
  } ),
});
