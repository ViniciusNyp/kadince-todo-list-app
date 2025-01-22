"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import { UserNav } from "../_components/user-nav";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session?.data?.user?.id) {
      void router.push("/auth/login");
    }
  }, [router, session?.data?.user?.id]);

  return (
    <>
      <div className="flex items-center justify-end p-4">
        <UserNav />
      </div>
      {children}
    </>
  );
}
