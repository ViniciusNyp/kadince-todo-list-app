"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session?.data?.user?.id) {
      void router.push("/user/todos");
    }
  }, [router, session?.data?.user?.id]);

  return children;
}
