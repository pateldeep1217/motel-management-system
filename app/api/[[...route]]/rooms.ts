import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { rooms, roomInsertSchema, userMotels } from "@/db/schema";

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
        const query = db
          .select({
            id: rooms.id,
            number: rooms.number,
            type: rooms.type,
            capacity: rooms.capacity,
            price: rooms.price,
            status: rooms.status,
            motelId: rooms.motelId,
            createdAt: rooms.createdAt,
            updatedAt: rooms.updatedAt,
          })
          .from(rooms)
          .innerJoin(userMotels, eq(rooms.motelId, userMotels.motelId))
          .where(eq(userMotels.userId, String(auth.token.id)))
          .limit(limit)
          .offset((page - 1) * limit)
          .orderBy(desc(rooms.createdAt));

        const data = await query;

        return c.json({
          data,
          nextPage: data.length === limit ? page + 1 : null,
        });
      } catch (error) {
        console.error("Error fetching rooms:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )

  .post(
    "/create",
    verifyAuth(),
    zValidator("json", roomInsertSchema),
    async (c) => {
      const auth = c.get("authUser");
      const values = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        // Check if the user has access to the motel
        const userMotel = await db
          .select()
          .from(userMotels)
          .where(
            and(
              eq(userMotels.userId, String(auth.token.id)),
              eq(userMotels.motelId, values.motelId)
            )
          )
          .limit(1);

        if (userMotel.length === 0) {
          return c.json({ error: "Unauthorized access to this motel" }, 403);
        }

        const [room] = await db
          .insert(rooms)
          .values({
            ...values,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return c.json({ data: room });
      } catch (error) {
        console.error("Error creating room:", error);
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
        const [data] = await db
          .select({
            id: rooms.id,
            number: rooms.number,
            type: rooms.type,
            capacity: rooms.capacity,
            price: rooms.price,
            status: rooms.status,

            motelId: rooms.motelId,
            createdAt: rooms.createdAt,
            updatedAt: rooms.updatedAt,
          })
          .from(rooms)
          .innerJoin(userMotels, eq(rooms.motelId, userMotels.motelId))
          .where(
            and(eq(rooms.id, id), eq(userMotels.userId, String(auth.token.id)))
          );

        if (!data) {
          return c.json({ error: "Room not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error("Error fetching room:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
