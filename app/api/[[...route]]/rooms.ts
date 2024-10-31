import { Hono } from "hono";
import { eq, asc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";

import { db } from "@/db";
import { rooms, userMotels, roomStatuses } from "@/db/schema";

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
          status: rooms.statusId,
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
  });

export default app;
