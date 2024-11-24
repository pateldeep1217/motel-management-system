import { Hono } from "hono";
import { eq, asc, and, gte, lte, or } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";

import { db } from "@/db";
import {
  bookings,
  rooms,
  userMotels,
  bookingInsertSchema,
  bookingStatuses,
  guests,
  roomStatuses,
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
          roomId: bookings.roomId,
          roomNumber: rooms.number,
          roomStatusId: rooms.statusId,
          roomStatus: roomStatuses.status,
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
        .innerJoin(roomStatuses, eq(rooms.statusId, roomStatuses.id))
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
    zValidator(
      "json",

      bookingInsertSchema.pick({
        guestName: true,
        roomId: true,
        checkInDate: true,
        checkOutDate: true,
        bookingStatusId: true,
        totalAmount: true,
        dailyRate: true,
        paymentMethod: true,
      })
    ),
    async (c) => {
      console.log("hit");
      const auth = c.get("authUser");

      const values = c.req.valid("json");
      console.log(values);
      console.log("recevied payload: ", c.req.parseBody);

      if (!auth || !auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [userMotel] = await db
        .select()
        .from(userMotels)
        .where(eq(userMotels.userId, auth.token.id as string));

      if (!userMotel) {
        return c.json({ error: "User's motel not found" }, 404);
      }

      // Validate and parse dates
      const checkIn = new Date(values.checkInDate);
      const checkOut = new Date(values.checkOutDate);
      console.log("Parsed check-in date:", checkIn);
      console.log("Parsed check-out date:", checkOut);

      // Check room availability
      const [existingBooking] = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.roomId, values.roomId),
            or(
              and(
                gte(bookings.checkInDate, checkIn),
                lte(bookings.checkInDate, checkOut)
              ),
              and(
                gte(bookings.checkOutDate, checkIn),
                lte(bookings.checkOutDate, checkOut)
              )
            )
          )
        )
        .limit(1);

      if (existingBooking) {
        return c.json(
          { error: "Room not available for the selected dates" },
          400
        );
      }

      // Retrieve the ID for the "Confirmed" status
      const [confirmedStatus] = await db
        .select()
        .from(bookingStatuses)
        .where(eq(bookingStatuses.status, "Confirmed"))
        .limit(1);

      if (!confirmedStatus) {
        return c.json({ error: "Confirmed status not found" }, 400);
      }

      // Use the provided status ID or default to "Confirmed"
      const statusId = values.bookingStatusId || confirmedStatus.id;

      // Retrieve or create guestId based on guestName
      let guestId: string;
      const [existingGuest] = await db
        .select()
        .from(guests)
        .where(eq(guests.name, values.guestName));

      if (existingGuest) {
        guestId = existingGuest.id as string;
      } else {
        const [newGuest] = await db
          .insert(guests)
          .values({
            name: values.guestName,
            motelId: userMotel.motelId,
            idProof: "",
            email: "",
            phone: "",
            idProofImageUrl: "",
            doNotRent: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        guestId = newGuest.id as string;
      }

      // Create booking
      const data = await db
        .insert(bookings)
        .values({
          roomId: values.roomId as string,
          guestId: guestId,
          guestName: values.guestName,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          bookingStatusId: statusId, // Use the determined status
          totalAmount: values.totalAmount,
          dailyRate: values.dailyRate,
          motelId: userMotel.motelId as string,
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
  .post("/check-in/:bookingId", verifyAuth(), async (c) => {
    const { bookingId } = c.req.param();
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    const [occupiedStatus] = await db
      .select()
      .from(roomStatuses)
      .where(eq(roomStatuses.status, "Occupied"))
      .limit(1);

    if (!occupiedStatus) {
      return c.json({ error: "Occupied status not found" }, 400);
    }

    const [checkedInStatus] = await db
      .select()
      .from(bookingStatuses)
      .where(eq(bookingStatuses.status, "CheckedIn"))
      .limit(1);
    if (!checkedInStatus) {
      return c.json({ error: "CheckedIn status not found" }, 400);
    }

    try {
      await db
        .update(rooms)
        .set({ statusId: occupiedStatus.id, updatedAt: new Date() })
        .where(eq(rooms.id, booking.roomId));

      await db
        .update(bookings)
        .set({ bookingStatusId: checkedInStatus.id, updatedAt: new Date() })
        .where(eq(bookings.id, bookingId));

      return c.json({ message: "Checked-in successfully" });
    } catch (error) {
      console.error("Update error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })

  .post("/check-out/:bookingId", verifyAuth(), async (c) => {
    const { bookingId } = c.req.param();
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    const [underCleaningStatus] = await db
      .select()
      .from(roomStatuses)
      .where(eq(roomStatuses.status, "Under Cleaning"))
      .limit(1);

    if (!underCleaningStatus) {
      return c.json({ error: "Under Cleaning status not found" }, 400);
    }

    const [checkedOutStatus] = await db
      .select()
      .from(bookingStatuses)
      .where(eq(bookingStatuses.status, "CheckedOut"))
      .limit(1);

    if (!checkedOutStatus) {
      return c.json({ error: "CheckedOut status not found" }, 400);
    }

    try {
      // Update room to "Under Cleaning"
      await db
        .update(rooms)
        .set({ statusId: underCleaningStatus.id, updatedAt: new Date() })
        .where(eq(rooms.id, booking.roomId));

      // Update booking to "CheckedOut"
      await db
        .update(bookings)
        .set({ bookingStatusId: checkedOutStatus.id, updatedAt: new Date() })
        .where(eq(bookings.id, bookingId));

      return c.json({ message: "Checked-out successfully" });
    } catch (error) {
      console.error("Update error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
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
