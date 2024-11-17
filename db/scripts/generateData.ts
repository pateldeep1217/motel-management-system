import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "..";

import {
  roomStatuses,
  bookingStatuses,
  rooms,
  guests,
  bookings,
} from "../schema";

dotenv.config();

const motelId = "55c51844-6cd2-4d5d-8e45-d1fed6ad28b9";

const roomStatusesList = ["Available", "Occupied", "Maintenance", "Cleaning"];
const bookingStatusesList = ["Confirmed", "Pending", "Cancelled"];

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
    const guestsData = Array.from({ length: 100 }, () => ({
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

    console.log("Inserting bookings...");
    const threeMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 3,
      now.getDate()
    );

    // Fetch room data
    const roomData = await db.select().from(rooms);

    // Fetch guest data
    const guestIds = (await db.select().from(guests)).map((guest) => ({
      id: guest.id,
      name: guest.name,
    }));

    const bookingsData = [];
    let monthlyRevenue = 0;
    const targetMinRevenue = 25000;
    const targetMaxRevenue = 30000;

    // Function to generate bookings for a specific room

    const generateBookingsForRoom = (room, startDate, endDate, isWeekly) => {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        if (
          monthlyRevenue < targetMinRevenue ||
          (monthlyRevenue < targetMaxRevenue && Math.random() < 0.7)
        ) {
          const guest = faker.helpers.arrayElement(guestIds);
          const checkInDate = createDate(currentDate);
          const checkOutDate = createDate(
            new Date(
              checkInDate.getTime() + (isWeekly ? 7 : 1) * 24 * 60 * 60 * 1000
            )
          );

          // Corrected total amount calculation
          const totalAmount = isWeekly ? room.price : room.price * 7;

          const bookingStatus = faker.helpers.arrayElement([
            bookingStatusIds["Confirmed"],
            bookingStatusIds["Pending"],
            bookingStatusIds["Cancelled"],
          ]);

          bookingsData.push({
            id: uuidv4(),
            roomId: room.id,
            guestId: guest.id,
            guestName: guest.name,
            motelId,
            checkInDate,
            checkOutDate,
            bookingStatusId: bookingStatus,
            totalAmount,
            dailyRate: isWeekly ? room.price / 7 : room.price, // Corrected daily rate
            paymentMethod: faker.helpers.arrayElement(["Card", "Cash"]),
            createdAt: now,
            updatedAt: now,
          });

          if (bookingStatus === bookingStatusIds["Confirmed"]) {
            monthlyRevenue += totalAmount;
          }
        }

        currentDate.setDate(currentDate.getDate() + (isWeekly ? 7 : 1));

        // Reset monthly revenue at the start of each month
        if (currentDate.getDate() === 1) {
          monthlyRevenue = 0;
        }
      }
    };

    // Generate bookings for each room
    for (const room of roomData) {
      const isKitchenette = room.type === "Kitchenette";
      const isWeekly = isKitchenette;
      generateBookingsForRoom(room, threeMonthsAgo, now, isWeekly);
    }

    // Update room statuses based on current bookings
    const todayStart = createDate(now);
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    for (const room of roomData) {
      const currentBooking = bookingsData.find(
        (booking) =>
          booking.roomId === room.id &&
          booking.checkInDate < todayEnd &&
          booking.checkOutDate > todayStart &&
          booking.bookingStatusId === bookingStatusIds["Confirmed"]
      );

      if (currentBooking) {
        await db
          .update(rooms)
          .set({ statusId: roomStatusIds["Occupied"] })
          .where(eq(rooms.id, room.id));
      }
    }

    // Insert bookings in batches
    const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    };

    const batchSize = 1000;
    const bookingsBatches = chunkArray(bookingsData, batchSize);

    for (const batch of bookingsBatches) {
      await db.insert(bookings).values(batch);
    }

    // Calculate actual monthly revenue
    const calculateMonthlyRevenue = () => {
      const revenueByMonth = {};
      bookingsData.forEach((booking) => {
        if (booking.bookingStatusId === bookingStatusIds["Confirmed"]) {
          const month = booking.checkInDate.getMonth();
          const year = booking.checkInDate.getFullYear();
          const key = `${year}-${month}`;
          revenueByMonth[key] =
            (revenueByMonth[key] || 0) + booking.totalAmount;
        }
      });
      return revenueByMonth;
    };

    const monthlyRevenues = calculateMonthlyRevenue();

    console.log("Seeding completed successfully!");
    console.log("Monthly revenues:");
    Object.entries(monthlyRevenues).forEach(([month, revenue]) => {
      console.log(`${month}: $${revenue.toFixed(2)}`);
    });
    console.log(`Total bookings generated: ${bookingsData.length}`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed().catch(console.error);
