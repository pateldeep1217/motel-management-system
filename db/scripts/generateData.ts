import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
import { db } from "..";

import {
  roomStatuses,
  bookingStatuses,
  rooms,
  guests,
  bookings,
} from "../schema";
import { eq } from "drizzle-orm";

dotenv.config();

const motelId = "55c51844-6cd2-4d5d-8e45-d1fed6ad28b9";

const roomStatusesList = [
  "Available",
  "Occupied",
  "Maintenance",
  "Cleaning",
  "Reserved",
  "Blocked",
];
const bookingStatusesList = [
  "Confirmed",
  "Pending",
  "Cancelled",
  "CheckedIn",
  "CheckedOut",
  "NoShow",
];

const roomStatusIds = roomStatusesList.reduce((acc, status) => {
  acc[status] = uuidv4();
  return acc;
}, {} as Record<string, string>);

const bookingStatusIds = bookingStatusesList.reduce((acc, status) => {
  acc[status] = uuidv4();
  return acc;
}, {} as Record<string, string>);

// Helper function to create a clean Date object
function createDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d;
}

async function seed() {
  try {
    console.log("Starting seed...");

    // Insert room statuses
    console.log("Inserting room statuses...");
    await db.insert(roomStatuses).values(
      Object.entries(roomStatusIds).map(([status, id]) => ({
        id,
        status,
      }))
    );

    // Insert booking statuses
    console.log("Inserting booking statuses...");
    await db.insert(bookingStatuses).values(
      Object.entries(bookingStatusIds).map(([status, id]) => ({
        id,
        status,
      }))
    );

    // Generate and insert rooms
    console.log("Inserting rooms...");
    const now = new Date();
    const roomsData = Array.from({ length: 22 }, (_, i) => {
      const number = 101 + i;
      let type: string;
      let price: number;
      let capacity: number;

      if (number === 101 || number === 110) {
        type = "Double Bed";
        price = 80;
        capacity = 4;
      } else if (number >= 102 && number <= 109) {
        type = "Single Bed";
        price = 65;
        capacity = 2;
      } else {
        type = "Kitchenette";
        price = 320;
        capacity = 2;
      }

      return {
        id: uuidv4(),
        motelId,
        number,
        type,
        price,
        capacity,
        statusId: roomStatusIds["Available"], // Default to Available
        createdAt: now,
        updatedAt: now,
      };
    });

    await db.insert(rooms).values(roomsData);

    // Generate and insert guests
    console.log("Inserting guests...");
    const guestsData = Array.from({ length: 50 }, () => ({
      id: uuidv4(),
      motelId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number("555-####"),
      idProof: `ID${faker.number.int({ min: 1000, max: 9999 })}`,
      createdAt: now,
      updatedAt: now,
    }));

    await db.insert(guests).values(guestsData);

    console.log("Part 1 seeding completed successfully!");

    // Proceed to generate bookings for today and tomorrow
    await generateBookings();
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Generate bookings for today and tomorrow
async function generateBookings() {
  const now = new Date();
  const today = createDate(now);
  const tomorrow = createDate(new Date(now.getTime() + 24 * 60 * 60 * 1000));

  const roomData = await db.select().from(rooms);
  const guestData = await db.select().from(guests);

  const guestIds = guestData.map((guest) => guest.id);

  const bookingsData = [];

  const generateBooking = (room, checkInDate, checkOutDate, status) => {
    const guestId = faker.helpers.arrayElement(guestIds);
    bookingsData.push({
      id: uuidv4(),
      roomId: room.id,
      guestId,
      guestName:
        guestData.find((guest) => guest.id === guestId)?.name || "Unknown",
      motelId,
      checkInDate,
      checkOutDate,
      bookingStatusId: status,
      totalAmount:
        room.price *
        Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)),
      dailyRate: room.price,
      paymentMethod: faker.helpers.arrayElement(["Card", "Cash"]),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  // Generate bookings for today and set room status to "Occupied"
  for (let i = 0; i < 10; i++) {
    const room = roomData.find((room) => room.number === 111 + i);
    if (room) {
      generateBooking(room, today, tomorrow, bookingStatusIds["CheckedIn"]);
      await db
        .update(rooms)
        .set({ statusId: roomStatusIds["Occupied"], updatedAt: new Date() })
        .where(eq(rooms.id, room.id));
    }
  }

  // Generate bookings for tomorrow and set room status to "Reserved"
  for (let i = 0; i < 10; i++) {
    const room = roomData.find(
      (room) => String(room.number) === String(111 + i)
    );
    if (room) {
      generateBooking(
        room,
        tomorrow,
        new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
        bookingStatusIds["Confirmed"]
      );
      await db
        .update(rooms)
        .set({ statusId: roomStatusIds["Reserved"], updatedAt: new Date() })
        .where(eq(rooms.id, room.id));
    }
  }

  // Insert bookings
  await db.insert(bookings).values(bookingsData);

  console.log("Bookings for today and tomorrow inserted successfully!");
}

seed().catch(console.error);
