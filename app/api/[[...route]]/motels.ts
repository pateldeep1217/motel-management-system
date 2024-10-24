import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { motels, users } from "@/db/schema";

const createMotelSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  description: z.string().optional(),
});

const updateMotelSchema = createMotelSchema.partial();

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
          .from(motels)
          .where(eq(motels.ownerId, String(auth.token.id)))
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
          .where(
            and(eq(motels.id, id), eq(motels.ownerId, String(auth.token.id)))
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
  )
  .patch(
    "/:id",
    verifyAuth(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", updateMotelSchema),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const data = await db
          .update(motels)
          .set({
            ...values,
            updatedAt: new Date(),
          })
          .where(
            and(eq(motels.id, id), eq(motels.ownerId, String(auth.token.id)))
          )
          .returning();

        if (data.length === 0) {
          return c.json({ error: "Motel not found" }, 404);
        }

        return c.json({ data: data[0] });
      } catch (error) {
        console.error("Error updating motel:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .delete(
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
          .delete(motels)
          .where(
            and(eq(motels.id, id), eq(motels.ownerId, String(auth.token.id)))
          )
          .returning();

        if (data.length === 0) {
          return c.json({ error: "Motel not found" }, 404);
        }

        return c.json({ data: { id } });
      } catch (error) {
        console.error("Error deleting motel:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
