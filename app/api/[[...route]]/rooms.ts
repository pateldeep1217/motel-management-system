import { Hono } from "hono";
import { eq, asc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";

import { db } from "@/db";
import {
  rooms,
  userMotels,
  roomStatuses,
  roomInsertSchema,
  motels,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";

const app = new Hono()
  .get("/", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

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
          status: roomStatuses.status,
          motelId: rooms.motelId,
          createdAt: rooms.createdAt,
          updatedAt: rooms.updatedAt,
        })
        .from(rooms)
        .innerJoin(userMotels, eq(rooms.motelId, userMotels.motelId))
        .leftJoin(roomStatuses, eq(rooms.statusId, roomStatuses.id))
        .where(eq(userMotels.userId, auth.token.id as string))
        .orderBy(asc(rooms.number));

      const data = await query;

      return c.json({
        data,
      });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .get("/statuses", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const query = db
        .select({
          id: roomStatuses.id,
          status: roomStatuses.status,
        })
        .from(roomStatuses)
        .orderBy(asc(roomStatuses.status));

      const data = await query;
      return c.json({
        data,
      });
    } catch (error) {
      console.error("Error fetching statues", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post("/", zValidator("json", roomInsertSchema), async (c) => {
    const auth = c.get("authUser");

    const values = c.req.valid("json");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userMotel = await db
      .select()
      .from(userMotels)
      .where(eq(userMotels.userId, auth.token.id as string));

    console.log(userMotel);

    const data = await db
      .insert(rooms)
      .values({
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!data[0]) {
      return c.json({ error: "Something went wrong" }, 400);
    }

    return c.json({ data: data[0] });
  });

export default app;
