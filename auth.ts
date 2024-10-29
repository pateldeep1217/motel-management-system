import NextAuth from "next-auth";
import bcrypt from "bcryptjs";

import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        name: {},
      },
      async authorize(credentials) {
        console.log("Authorize method called"); // Check if this log appears

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));
        console.log(
          "Attempting to authorize user with email:",
          credentials.email
        );

        if (!user) {
          throw new Error("incorrect crenditals");
        } else {
          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );

          if (!passwordMatch) {
            throw new Error("Incorrect crenditals");
          }
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        try {
          // token.id is already a string UUID, no need for parseInt
          const [userExists] = await db
            .select()
            .from(users)
            .where(eq(users.id, token.id as string)); // Make sure to pass as string

          if (!userExists) {
            return {
              ...session,
              user: {
                ...session.user,
                id: undefined,
                name: undefined,
                email: undefined,
              },
            };
          }

          session.user.id = userExists.id.toString();
          session.user.name = userExists.name;
        } catch (error) {
          console.error("Session check error:", error);
          return {
            ...session,
            user: {
              ...session.user,
              id: undefined,
              name: undefined,
              email: undefined,
            },
          };
        }
      }
      return session;
    },
  },
});
