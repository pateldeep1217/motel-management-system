import { z } from "zod";
import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db"; // Adjust import path as necessary
import { rooms, roomInsertSchema, motels } from "@/db/schema"; // Adjust import path as necessary

const updateRoomSchema = roomInsertSchema.partial(); // Reuse the existing schema for updates

const app = new Hono();

app
  .get(
    "/:motelId",
    verifyAuth(),
    zValidator("param", z.object({ motelId: z.string() })),
    async (c) => {
      const auth = c.get("authUser");
      const { motelId } = c.req.valid("param");

      if (!auth.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const data = await db
          .select()
          .from(rooms)
          .where(eq(rooms.motelId, motelId));

        if (data.length === 0) {
          return c.json({ error: "No rooms found for this motel" }, 404);
        }

        return c.json({ data });
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

      if (!auth.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        // Fetch the user's motel
        const userMotel = await db.query.motels.findFirst({
          where: eq(motels.ownerId, auth.user.id),
        });

        if (!userMotel) {
          return c.json(
            { error: "You don't have a motel associated with your account" },
            403
          );
        }

        const [room] = await db
          .insert(rooms)
          .values({
            ...values,
            motelId: userMotel.id, // Use the fetched motel's ID
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

      if (!auth.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const userMotel = await db.query.motels.findFirst({
          where: eq(motels.ownerId, auth.user.id),
        });

        if (!userMotel) {
          return c.json(
            { error: "No motel associated with your account" },
            403
          );
        }

        const data = await db
          .select()
          .from(rooms)
          .where(and(eq(rooms.id, id), eq(rooms.motelId, userMotel.id)));

        if (data.length === 0) {
          return c.json({ error: "Room not found" }, 404);
        }

        return c.json({ data: data[0] });
      } catch (error) {
        console.error("Error fetching room:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .patch(
    "/:id",
    verifyAuth(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", updateRoomSchema),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!auth.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const userMotel = await db.query.motels.findFirst({
          where: eq(motels.ownerId, auth.user.id),
        });

        if (!userMotel) {
          return c.json(
            { error: "No motel associated with your account" },
            403
          );
        }

        const data = await db
          .update(rooms)
          .set({
            ...values,
            updatedAt: new Date(),
          })
          .where(and(eq(rooms.id, id), eq(rooms.motelId, userMotel.id)))
          .returning();

        if (data.length === 0) {
          return c.json({ error: "Room not found" }, 404);
        }

        return c.json({ data: data[0] });
      } catch (error) {
        console.error("Error updating room:", error);
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

      if (!auth.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const userMotel = await db.query.motels.findFirst({
          where: eq(motels.ownerId, auth.user.id),
        });

        if (!userMotel) {
          return c.json(
            { error: "No motel associated with your account" },
            403
          );
        }

        const data = await db
          .delete(rooms)
          .where(and(eq(rooms.id, id), eq(rooms.motelId, userMotel.id)))
          .returning();

        if (data.length === 0) {
          return c.json({ error: "Room not found" }, 404);
        }

        return c.json({ data: { id } });
      } catch (error) {
        console.error("Error deleting room:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
