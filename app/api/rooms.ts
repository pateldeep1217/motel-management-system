import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { rooms, users } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq } from "drizzle-orm";

const app = new Hono();

// Fetch all rooms for a motel
app.get("/rooms", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, auth.userId))
    .first();
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const data = await db
    .select()
    .from(rooms)
    .where(eq(rooms.motelId, c.req.query("motelId")));
  return c.json({ data });
});

// Fetch a specific room by ID
app.get("/rooms/:id", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);
  const { id } = c.req.param();
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, auth.userId))
    .first();
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const [data] = await db.select().from(rooms).where(eq(rooms.id, id));
  if (!data) {
    return c.json({ error: "Room not found" }, 404);
  }

  return c.json({ data });
});

// Create a new room
app.post(
  "/rooms",
  clerkMiddleware(),
  zValidator(
    "json",
    z.object({
      motelId: z.string(),
      number: z.string(),
      type: z.string(),
      capacity: z.number(),
      price: z.number(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, auth.userId))
      .first();
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const [data] = await db
      .insert(rooms)
      .values({
        id: createId(),
        ...values,
        isOccupied: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return c.json({ data });
  }
);

// Update a room
app.patch(
  "/rooms/:id",
  clerkMiddleware(),
  zValidator(
    "json",
    z.object({
      number: z.string().optional(),
      type: z.string().optional(),
      capacity: z.number().optional(),
      price: z.number().optional(),
      isOccupied: z.boolean().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.param();
    const values = c.req.valid("json");
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, auth.userId))
      .first();
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const [data] = await db
      .update(rooms)
      .set(values)
      .where(eq(rooms.id, id))
      .returning();
    if (!data) {
      return c.json({ error: "Room not found" }, 404);
    }

    return c.json({ data });
  }
);

// Delete a room
app.delete("/rooms/:id", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);
  const { id } = c.req.param();
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, auth.userId))
    .first();
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const [data] = await db.delete(rooms).where(eq(rooms.id, id)).returning();
  if (!data) {
    return c.json({ error: "Room not found" }, 404);
  }

  return c.json({ data });
});

export default app;
