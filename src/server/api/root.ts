import { todoRouter } from "~/server/api/routers/todos";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  todo: todoRouter,
  user: userRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
