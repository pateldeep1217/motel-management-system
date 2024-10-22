"use server";

import { signIn } from "@/auth";
import { signInSchema } from "../Validation/signInSchema"; // Schema for login validation
import { db } from "@/db";
import { motels, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const loginValidationResult = signInSchema.safeParse({ email, password });

  if (!loginValidationResult.success) {
    return {
      error: true,
      message:
        loginValidationResult.error.issues[0]?.message ?? "An error occurred",
    };
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .single();

    if (!user) {
      return { error: true, message: "Invalid email or password" };
    }
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    const motel = await db
      .select()
      .from(motels)
      .where(eq(motels.ownerId, users.id));
    if (!motel) {
      return { redirect: `/create-motel?userId=${user.id}` };
    }
  } catch (e) {
    return {
      error: true,
      message: "An error occured during sign in",
    };
  }
};
