"use client";
import { Button } from "~/components/ui/button";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession, signIn } from "next-auth/react";

import { z } from "zod";
import { Loader2 } from "lucide-react";
import router from "next/router";

const loginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username or email is required" })
    .or(z.string().email()),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export default function Login() {
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    return await signIn("credentials", values).finally(() => setLoading(false));
  };

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Enter your username below to login to your account
            </p>
          </div>
          <Form {...loginForm}>
            <form
              className="grid gap-4"
              onSubmit={loginForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                Login
                {loading && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
