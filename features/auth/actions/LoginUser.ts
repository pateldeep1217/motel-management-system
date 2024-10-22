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
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
  } catch (e) {
    return {
      error: true,
      message: "An error occured during sign in",
    };
  }
};
