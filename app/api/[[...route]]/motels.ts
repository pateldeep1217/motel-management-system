import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { motels, motelInsertSchema, userMotels } from "@/db/schema";

const app = new Hono()

  .get("/", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const data = await db
        .select()
        .from(userMotels)
        .innerJoin(motels, eq(userMotels.motelId, motels.id))
        .where(eq(userMotels.userId, auth.token.id as string))
        .orderBy(desc(motels.createdAt));

      return c.json({
        data,
      });
    } catch (error) {
      console.error("Error fetching motels:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })

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
        const [newMotel] = await db
          .insert(motels)
          .values({
            ...values,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        await db.insert(userMotels).values({
          userId: String(auth.token.id),
          motelId: newMotel.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return c.json(newMotel);
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
