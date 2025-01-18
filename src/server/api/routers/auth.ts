import { eq, and } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,

  publicProcedure,
} from "~/server/api/trpc";
import {  users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({ username: z.string().min(1), password: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values({
        username: input.username,
        password: input.password,
      });
    }),

  login: publicProcedure
    .input(
      z.object({ username: z.string().min(1), password: z.string().min(1) }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: and(
          eq(users.username, input.username),
          eq(users.password, input.password),
        ),
      });

      return user ?? null;
    }),
});
