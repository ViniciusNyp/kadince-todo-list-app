"use client";
import { TodoList } from "~/app/_components/todo-list";

import { api } from "../../trpc/react";

export default function Todos() {
  const { data } = api.todo.getAll.useQuery();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {data?.length && <TodoList data={data} />}
      </div>
    </main>
  );
}
