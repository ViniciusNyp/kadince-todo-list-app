import { todoRouter } from "~/server/api/routers/todos";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/auth";

export const appRouter = createTRPCRouter({
  todo: todoRouter,
  user: userRouter,
});

export const createCaller = createCallerFactory(appRouter);
