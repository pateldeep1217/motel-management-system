import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { rooms, bookings, roomStatuses, bookingStatuses } from "@/db/schema";

export type SyncResult = {
  success: boolean;
  message: string;
};

export async function syncRoomAvailability(
  roomId: string,
  date: Date = new Date()
): Promise<SyncResult> {
  try {
    const room = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);
    if (!room) {
      return { success: false, message: "Room not found" };
    }

    const activeBooking = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, roomId),
          gte(bookings.checkInDate, date),
          lte(bookings.checkOutDate, date),
          eq(bookings.bookingStatusId, await getBookingStatusId("Confirmed"))
        )
      )
      .limit(1);

    const newStatus = activeBooking ? "Occupied" : "Available";
    const newStatusId = await getRoomStatusId(newStatus);

    if (room[0].statusId !== newStatusId) {
      await db
        .update(rooms)
        .set({ statusId: newStatusId })
        .where(eq(rooms.id, roomId));
    }

    return { success: true, message: "Room availability synchronized" };
  } catch (error) {
    console.error("Error syncing room availability:", error);
    return { success: false, message: "Failed to sync room availability" };
  }
}

async function getRoomStatusId(status: string): Promise<string> {
  const result = await db
    .select()
    .from(roomStatuses)
    .where(eq(roomStatuses.status, status))
    .limit(1);
  return result[0].id;
}

async function getBookingStatusId(status: string): Promise<string> {
  const result = await db
    .select()
    .from(bookingStatuses)
    .where(eq(bookingStatuses.status, status))
    .limit(1);
  return result[0].id;
}
