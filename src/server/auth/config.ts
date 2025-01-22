import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { users } from "../db/schema";
import { z } from "zod";


/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
    }
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        const authSchema = z.object({ username: z.string().min(1), password: z.string().min(1) });

        const input = authSchema.parse(credentials);

        const user = await db.query.users.findFirst({
          columns: { id: true, username: true },
          where: and(
            eq(users.username, input.username),
            eq(users.password, input.password),
          ),
        });

        return user ?? null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // signOut: "/logout",
    newUser: "/register",
    // error: "/login",
  }
} satisfies NextAuthConfig;
