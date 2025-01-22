import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { type ReactElement, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Textarea } from "../../components/ui/textarea";

import { Button } from "../../components/ui/button";
import { api } from "../../trpc/react";
import { type Todo } from "./todo-list";

const todoFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().trim().default(""),
});

export function TodoFormPopover({
  children,
  actionOnSubmit,
  todo,
}: {
  children: ReactNode;
  actionOnSubmit?: () => void;
  todo?: Todo;
}): ReactElement {
  const addTodoForm = useForm<z.infer<typeof todoFormSchema>>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      name: todo?.name ?? "",
      description: todo?.description ?? "",
    },
  });

  const utils = api.useUtils();

  const createTodoMutation = api.todo.create.useMutation({
    onMutate: async (newEntry) => {
      await utils.todo.getAll.cancel();
      utils.todo.getAll.setData(undefined, (prevEntries) => {
        const defaultValues = {
          id: Date.now(),
          done: false,
          createdById: "",
          createdAt: new Date(),
          updatedAt: null,
          description: newEntry.description ?? null,
        };

        if (prevEntries) {
          return [{ ...defaultValues, ...newEntry }, ...prevEntries];
        } else {
          return [{ ...defaultValues, ...newEntry }];
        }
      });
    },
    onSettled: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const updateTodoMutation = api.todo.update.useMutation({
    onMutate: async (newEntry) => {
      await utils.todo.getAll.cancel();
      utils.todo.getAll.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return prevEntries.map((entry) =>
            entry.id === newEntry.id
              ? { ...entry, ...newEntry }
              : entry,
          );
        }
      });
    },
    onSettled: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof todoFormSchema>> = async (
    values: z.infer<typeof todoFormSchema>,
  ) => {
    if (todo?.id) {
      updateTodoMutation.mutate({ ...values, id: todo.id });
    } else {
      createTodoMutation.mutate(values);
    }
    actionOnSubmit?.();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="">
        <Form {...addTodoForm}>
          <form onSubmit={addTodoForm.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={addTodoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="max-w-full"
                        placeholder="Name..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={addTodoForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description here..." {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" onClick={addTodoForm.handleSubmit(onSubmit)}>
              Save
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
