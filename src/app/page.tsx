"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  if (session?.data?.user?.id) {
    router.push("/user/todos");
  } else {
    router.push("/auth/login");
  }
  return <></>;
}
