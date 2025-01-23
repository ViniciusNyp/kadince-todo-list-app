"use client";
import { TodoList } from "~/app/_components/todo-list";

import { api } from "../../../trpc/react";

export default function Todos() {
  const { data } = api.todo.getAll.useQuery();
  return (
    <main className="flex flex-col items-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <TodoList data={data} />
      </div>
    </main>
  );
}
