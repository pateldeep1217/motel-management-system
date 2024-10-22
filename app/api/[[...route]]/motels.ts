import { z } from "zod";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/db";
import { motels, users } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";

const app = new Hono();

const createMotelSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
});

app.post(
  "/api/create-motel",
  verifyAuth(),
  zValidator("json", createMotelSchema),
  async (c) => {
    const authUser = c.get("authUser");
    const { name, address } = c.req.valid("json");
    const userId = authUser.user?.id;

    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const [motel] = await db
        .insert(motels)
        .values({
          name,
          address,
          ownerId: userId, // Set ownerId from authenticated user
        })
        .returning();

      // Update the user's role to admin
      await db.update(users).set({ role: "admin" }).where(eq(users.id, userId));

      return c.json({ data: { motel, userId } });
    } catch (e) {
      return c.json(
        { error: "An error occurred while creating the motel" },
        400
      );
    }
  }
);

export default app;
