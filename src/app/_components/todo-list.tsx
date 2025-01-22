"use client";
import { Plus, Pencil, Trash2 } from "lucide-react";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TodoFormPopover } from "./todo-form-popover";
import { type InferSelectModel } from "drizzle-orm";
import { type todos } from "../../server/db/schema";
import { api } from "../../trpc/react";

export type Todo = InferSelectModel<typeof todos>;

export function TodoList({ data }: { data: Todo[] }) {
  const utils = api.useUtils();

  const updateTodoMutation = api.todo.update.useMutation({
    onMutate: async (newEntry) => {
      await utils.todo.getAll.cancel();
      utils.todo.getAll.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return prevEntries.map((entry) =>
            entry.id === newEntry.id ? { ...entry, ...newEntry } : entry,
          );
        }
      });
    },

    onSettled: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const markTodoAsReady = (id: number, done: boolean) => {
    updateTodoMutation.mutate({ id, done });
  };

  const removeTodoMutation = api.todo.remove.useMutation({
    onMutate: async (newEntry) => {
      await utils.todo.getAll.cancel();
      utils.todo.getAll.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return prevEntries.filter((entry) => entry.id !== newEntry.id);
        }
      });
    },
    onSettled: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const columns: ColumnDef<Todo>[] = [
    {
      accessorKey: "done",
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center">
          <Checkbox
            className="rounded-full"
            checked={row.original.done}
            onCheckedChange={(value) =>
              markTodoAsReady(row.original.id, !!value)
            }
            aria-label="Done"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <>
            <Button
              variant="ghost"
              className="px-0"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Name
              <ArrowUpDown />
            </Button>
          </>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("status")}</div>
    //   ),
    // },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const todo = row.original;

        return (
          <div className="flex items-center justify-evenly">
            <TodoFormPopover todo={todo}>
              <Button variant={"ghost"}>
                <Pencil />
              </Button>
            </TodoFormPopover>
            <Button
              onClick={() => removeTodoMutation.mutate({ id: todo.id })}
              variant={"ghost"}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="mr-6"
        />
        <TodoFormPopover>
          <Button className="rounded-xl">
            <Plus />
          </Button>
        </TodoFormPopover>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
}
