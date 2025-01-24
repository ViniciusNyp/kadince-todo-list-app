"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";

import { z } from "zod";
import Link from "next/link";
import { api } from "../../../trpc/react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useToast } from "../../../hooks/use-toast";

const registerFormSchema = z
  .object({
    username: z.string().trim().min(1, { message: "Username is required" }),
    password: z
      .string()
      .trim()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password need to be at least 8 characters" }),
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: "Confirm password is required" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
export default function Register() {
  const { toast } = useToast();

  const registerMutation = api.user.register.useMutation({
    onSuccess: () => {
      toast({ title: "Registration successful" });
      void signIn();
    },
    onError: () => {
      toast({ title: "Registration failed", variant: "destructive" });
    },
  });

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerFormSchema>) =>
    registerMutation.mutate(values);

  return (
    <div className="h-screen w-full">
      <div className="flex h-full w-full flex-col items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <Form {...registerForm}>
            <form
              className="grid gap-4"
              onSubmit={registerForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Password confirmation</FormLabel>
                    <FormControl>
                      <Input placeholder="Retype your password..." {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full"
              >
                Create an account
                {registerMutation.isPending && (
                  <Loader2 className="animate-spin" />
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
