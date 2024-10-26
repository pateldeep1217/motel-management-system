import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { motels, motelInsertSchema } from "@/db/schema";

const createMotelSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  description: z.string().optional(),
});

const app = new Hono()

  .get(
    "/user-motels",
    verifyAuth(),
    zValidator(
      "query",
      z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { page, limit } = c.req.valid("query");

      console.log("Authenticated User:", auth);
      console.log("Page:", page, "Limit:", limit);

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const userMotelsData = await db
          .select()
          .from(motels)
          .where(eq(motels.ownerId, String(auth.token.id)))
          .limit(limit)
          .offset((page - 1) * limit)
          .orderBy(desc(motels.createdAt));

        return c.json({
          userMotelsData,
          nextPage: userMotelsData.length === limit ? page + 1 : null,
        });
      } catch (error) {
        console.error("Error fetching motels:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .post(
    "/create",
    verifyAuth(),
    zValidator("json", createMotelSchema),
    async (c) => {
      const auth = c.get("authUser");
      const values = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [motel] = await db
          .insert(motels)
          .values({
            ...values,
            ownerId: String(auth.token.id),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return c.json({ data: motel });
      } catch (error) {
        console.error("Error creating motel:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
