"use client";

import { api } from "~/trpc/react";

export function TodoList() {
  const [todos] = api.todo.getAll.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs">
      {todos?.length &&
        todos.map((todo) => (
          <div
            key={todo.id}
            className="mb-4 flex items-center justify-between rounded-xl bg-white/10 p-4"
          >
            <div>
              <h3 className="text-xl font-semibold">{todo.name}</h3>
              <p className="text-lg">{todo.description}</p>
            </div>
            <div>
              <input type="checkbox" defaultChecked={todo.done} />
            </div>
          </div>
        ))}
    </div>
  );
}
