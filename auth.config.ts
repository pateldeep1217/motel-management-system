import { z } from "zod";
import bcrypt from "bcryptjs";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { userMotels, users } from "./db/schema";
import { eq } from "drizzle-orm";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
declare module "next-auth" {
  interface User {
    motelId?: string; // Add motelIds to User type
  }

  interface Session {
    user: {
      id: string;
      motelId?: string; // Ensure motelIds exists on session user
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

export default {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        const user = query[0];

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }
        // Fetch the motelId(s) for the user
        const motelQuery = await db
          .select({ motelId: userMotels.motelId })
          .from(userMotels)
          .where(eq(userMotels.userId, user.id));
        const motelId = motelQuery[0]?.motelId;

        return {
          ...user,
          motelId,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      if (token.motelId) {
        session.user.motelId = token.motelId.toString();
      }
      console.log("Session:", session);
      console.log("Token:", token);

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.motelId = user.motelId;
      }

      console.log("Token jwt:", token);
      return token;
    },
  },
} satisfies NextAuthConfig;
