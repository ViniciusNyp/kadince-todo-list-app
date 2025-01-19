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

const addTodoFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().trim().default(""),
});

export function AddTodoPopover({
  children,
  actionOnSubmit,
}: {
  children: ReactNode;
  actionOnSubmit?: () => void;
}): ReactElement {
  const addTodoForm = useForm<z.infer<typeof addTodoFormSchema>>({
    resolver: zodResolver(addTodoFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const utils = api.useUtils();

  const createTodoMutation = api.todo.create.useMutation({
    onMutate: async (newEntry) => {
      await utils.todo.getAll.cancel();
      utils.todo.getAll.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return [newEntry, ...prevEntries];
        } else {
          return [newEntry];
        }
      });
    },
    onSettled: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof addTodoFormSchema>> = async (
    values: z.infer<typeof addTodoFormSchema>,
  ) => {
    createTodoMutation.mutate(values);
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
              Add
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
