"use server";

import { signUpSchema } from "../Validation/signUpSchema";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
export const registerUser = async ({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const signupValidationResult = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!signupValidationResult.success) {
      return {
        error: true,
        message:
          signupValidationResult.error.issues[0]?.message ?? "An error occured",
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashPassword,
    });
  } catch (e: any) {
    if (e.code === "23505") {
      return {
        error: true,
        message: "An email already exists",
      };
    }

    return {
      error: true,
      message: "An error occurred",
    };
  }
};
