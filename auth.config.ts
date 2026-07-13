import type { NextAuthConfig } from "next-auth";
import { resolveAuthRedirect } from "@/lib/auth-url";

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
  trustHost: true,
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
    /**
     * Keep post-login redirects on the real deployment host.
     * Stops AUTH_URL=localhost (common Vercel misconfig) from hijacking users.
     */
    async redirect({ url, baseUrl }) {
      return resolveAuthRedirect(url, baseUrl);
    },
  },
} satisfies NextAuthConfig;
