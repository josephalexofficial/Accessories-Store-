import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config for middleware. Keep this file free of Prisma/bcrypt imports.
 */
export const authConfig = {
  pages: {
    signIn: "/admin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
