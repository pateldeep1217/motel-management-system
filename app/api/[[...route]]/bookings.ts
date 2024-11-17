import { Hono } from "hono";
import { eq, asc, and } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";

import { db } from "@/db";
import {
  bookings,
  rooms,
  userMotels,
  bookingInsertSchema,
  bookingStatuses,
} from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
  .get("/", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const query = db
        .select({
          id: bookings.id,
          roomNumber: rooms.number,
          guestName: bookings.guestName,
          checkInDate: bookings.checkInDate,
          checkOutDate: bookings.checkOutDate,
          status: bookingStatuses.status,
          statusId: bookings.bookingStatusId,
          totalAmount: bookings.totalAmount,
          paymentMethod: bookings.paymentMethod,
          dailyRate: bookings.dailyRate,
        })
        .from(bookings)
        .innerJoin(rooms, eq(bookings.roomId, rooms.id))
        .innerJoin(userMotels, eq(rooms.motelId, userMotels.motelId))
        .innerJoin(
          bookingStatuses,
          eq(bookings.bookingStatusId, bookingStatuses.id)
        )
        .where(eq(userMotels.userId, auth.token.id as string))
        .orderBy(asc(bookings.checkInDate));

      const data = await query;

      return c.json({
        data,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .get("/statuses", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth?.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const query = db
        .select({
          id: bookingStatuses.id,
          status: bookingStatuses.status,
        })
        .from(bookingStatuses)
        .orderBy(asc(bookingStatuses.status));

      const rawData = await query;
      const data = rawData.map((status) => ({
        ...status,
        status: status.status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      }));

      return c.json({ data });
    } catch (error) {
      console.error("Error fetching statuses:", error);
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
            id: bookings.id,
            roomNumber: rooms.number,
            guestName: bookings.guestName,
            checkInDate: bookings.checkInDate,
            checkOutDate: bookings.checkOutDate,
            bookingStatusId: bookings.bookingStatusId,
          })
          .from(bookings)
          .innerJoin(rooms, eq(bookings.roomId, rooms.id))
          .innerJoin(userMotels, eq(rooms.motelId, userMotels.motelId))
          .where(
            and(
              eq(bookings.id, id as string),
              eq(userMotels.userId, auth.token.id as string)
            )
          );

        if (!data) {
          return c.json({ error: "Booking not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error("Error fetching booking by ID:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .post(
    "/",
    verifyAuth(),
    zValidator("json", bookingInsertSchema),
    async (c) => {
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
        .insert(bookings)
        .values({
          roomId: values.roomId,
          guestId: values.guestId,
          guestName: values.guestName,
          checkInDate: values.checkInDate,
          checkOutDate: values.checkOutDate,
          bookingStatusId: values.bookingStatusId,
          totalAmount: values.totalAmount,
          dailyRate: values.dailyRate,
          motelId: userMotel.motelId,
          paymentMethod: values.paymentMethod,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!data[0]) {
        return c.json({ error: "Something went wrong" }, 400);
      }

      return c.json({ data: data[0] });
    }
  )

  .patch(
    "/:id",
    verifyAuth(),
    zValidator("json", bookingInsertSchema.partial()),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
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
        updatedAt: new Date(),
      };

      const data = await db
        .update(bookings)
        .set(updates)
        .where(
          and(
            eq(bookings.id, id as string),
            eq(bookings.motelId, userMotel.motelId)
          )
        )
        .returning();

      if (!data[0]) {
        return c.json({ error: "Booking not found or not updated" }, 404);
      }

      return c.json({ data: data[0] });
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

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [userMotel] = await db
          .select()
          .from(userMotels)
          .where(eq(userMotels.userId, auth.token.id as string));

        const [data] = await db
          .delete(bookings)
          .where(
            and(
              eq(bookings.id, id as string),
              eq(bookings.motelId, userMotel.motelId)
            )
          )
          .returning({
            id: bookings.id,
          });

        if (!data) {
          return c.json({ error: "Booking not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error("Error deleting booking:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  );

export default app;
