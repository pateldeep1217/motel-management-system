import { Hono } from "hono";
import { eq, asc, and } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";

import { db } from "@/db";
import { rooms, userMotels, roomStatuses, roomInsertSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

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
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const query = db
        .select({
          id: roomStatuses.id,
          status: roomStatuses.status,
        })
        .from(roomStatuses)
        .orderBy(asc(roomStatuses.status));

      const rawData = await query;
      console.log("rawdata", rawData);
      const data = rawData.map((status) => ({
        ...status,
        status: status.status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      }));
      return c.json({ data });
    } catch (error) {
      console.error("Error fetching statuses", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    verifyAuth(),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

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
            status: roomStatuses.status,
            motelId: rooms.motelId,
          })
          .from(rooms)
          .innerJoin(userMotels, eq(rooms.motelId, userMotels.motelId))
          .innerJoin(roomStatuses, eq(rooms.statusId, roomStatuses.id))
          .where(
            and(
              eq(rooms.id, id as string),
              eq(userMotels.userId, auth.token.id as string)
            )
          );

        if (!data) {
          return c.json({ error: "Room not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error("Error fetching room by ID:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )

  .post("/", verifyAuth(), zValidator("json", roomInsertSchema), async (c) => {
    const auth = c.get("authUser");

    const values = c.req.valid("json");

    if (!auth || !auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [userMotel] = await db
      .select()
      .from(userMotels)
      .where(eq(userMotels.userId, auth.token.id as string));

    const data = await db
      .insert(rooms)
      .values({
        number: values.number,
        price: values.price,
        statusId: values.statusId,
        type: capitalizeFirstLetter(values.type),
        capacity: values.capacity,
        motelId: userMotel.motelId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!data[0]) {
      return c.json({ error: "Something went wrong" }, 400);
    }

    return c.json({ data: data[0] });
  })
  .patch(
    "/:id",
    verifyAuth(),
    // Validate both the body and the route parameter
    zValidator("json", roomInsertSchema.partial()),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ), // Validate the 'id' parameter
    async (c) => {
      const auth = c.get("authUser");
      const values = c.req.valid("json");
      const { id } = c.req.valid("param");
      if (!auth || !auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [userMotel] = await db
        .select()
        .from(userMotels)
        .where(eq(userMotels.userId, auth.token.id as string));

      const updates = {
        ...values,
        type: values.type ? capitalizeFirstLetter(values.type) : undefined,
        updatedAt: new Date(),
      };

      const data = await db
        .update(rooms)
        .set(updates)
        .where(
          and(eq(rooms.id, id as string), eq(rooms.motelId, userMotel.motelId))
        )
        .returning();

      if (!data[0]) {
        return c.json({ error: "Room not found or not updated" }, 404);
      }

      return c.json({ data: data[0] });
    }
  )
  .patch(
    "/updatestatus/:id",
    verifyAuth(),
    zValidator(
      "param",
      z.object({
        id: z.string().uuid(),
      })
    ),
    zValidator(
      "json",
      z.object({
        status: z.string(), // Now accepts any string
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");
      const { status } = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [userMotel] = await db
          .select()
          .from(userMotels)
          .where(eq(userMotels.userId, auth.token.id as string));

        if (!userMotel) {
          return c.json({ error: "User not associated with any motel" }, 400);
        }

        const [updatedRoom] = await db
          .update(rooms)
          .set({
            statusId: status, // Changed from statusId to status
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(rooms.id, id as string),
              eq(rooms.motelId, userMotel.motelId)
            )
          )
          .returning();

        if (!updatedRoom) {
          return c.json({ error: "Room not found or not updated" }, 404);
        }

        return c.json({ data: updatedRoom });
      } catch (error) {
        console.error("Error updating room status:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )

  .delete(
    "/:id",
    verifyAuth(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");

      if (!auth || !auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [userMotel] = await db
          .select()
          .from(userMotels)
          .where(eq(userMotels.userId, auth.token.id as string));

        const [data] = await db
          .delete(rooms)
          .where(
            and(
              eq(rooms.id, id as string),
              eq(rooms.motelId, userMotel.motelId)
            )
          )
          .returning({
            id: rooms.id,
          });

        if (!data) {
          return c.json({ error: "Room not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error("Error deleting room:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
