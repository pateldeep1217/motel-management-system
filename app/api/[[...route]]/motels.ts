import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { motels, motelInsertSchema, userMotels } from "@/db/schema";

const app = new Hono()

  .get(
    "/",
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

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const data = await db
          .select()
          .from(userMotels)
          .innerJoin(motels, eq(userMotels.motelId, motels.id))
          .where(eq(userMotels.userId, String(auth.token.id)))
          .limit(limit)
          .offset((page - 1) * limit)
          .orderBy(desc(motels.createdAt));

        return c.json({
          data,
          nextPage: data.length === limit ? page + 1 : null,
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
    zValidator("json", motelInsertSchema),
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
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        // Insert the user and motel relationship into userMotels
        await db.insert(userMotels).values({
          userId: String(auth.token.id),
          motelId: motel.id,
        });

        return c.json({ data: motel });
      } catch (error) {
        console.error("Error creating motel:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )

  .get(
    "/:id",
    verifyAuth(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const data = await db
          .select()
          .from(motels)
          .innerJoin(userMotels, eq(userMotels.motelId, motels.id))
          .where(
            and(eq(motels.id, id), eq(userMotels.userId, String(auth.token.id)))
          );

        if (data.length === 0) {
          return c.json({ error: "Motel not found" }, 404);
        }

        return c.json({ data: data[0] });
      } catch (error) {
        console.error("Error fetching motel:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );
export default app;
