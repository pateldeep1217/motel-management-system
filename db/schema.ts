import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["admin", "staff"]);
export const roomStatusEnum = pgEnum("room_status", [
  "available",
  "occupied",
  "maintenance",
  "cleaning",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const motels = pgTable("motel", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rooms = pgTable("room", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  motelId: text("motel_id")
    .notNull()
    .references(() => motels.id, { onDelete: "cascade" }),
  number: text("number").notNull(),
  type: text("type"),
  capacity: integer("capacity"),
  price: integer("price"),
  status: roomStatusEnum("status").default("available"),
  isOccupied: boolean("is_occupied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const guests = pgTable("guest", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  motelId: text("motel_id")
    .notNull()
    .references(() => motels.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  idProof: text("id_proof").notNull(),
  idProofImageUrl: text("id_proof_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("booking", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  motelId: text("motel_id")
    .notNull()
    .references(() => motels.id, { onDelete: "cascade" }),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  guestId: text("guest_id")
    .notNull()
    .references(() => guests.id, { onDelete: "cascade" }),
  checkIn: timestamp("check_in", { mode: "date" }).notNull(),
  checkOut: timestamp("check_out", { mode: "date" }).notNull(),
  status: bookingStatusEnum("status").default("confirmed"),
  totalAmount: numeric("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userMotels = pgTable(
  "user_motels",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    motelId: text("motel_id")
      .notNull()
      .references(() => motels.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").default("staff"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (userMotels) => ({
    compositePk: primaryKey({
      columns: [userMotels.userId, userMotels.motelId],
    }),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  motels: many(userMotels), // connects to motels via user_motels
}));

export const motelsRelations = relations(motels, ({ many }) => ({
  users: many(userMotels), // connects to users via user_motels
  rooms: many(rooms),
  guests: many(guests),
  bookings: many(bookings),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  motel: one(motels, { fields: [rooms.motelId], references: [motels.id] }),
  bookings: many(bookings),
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
  motel: one(motels, { fields: [guests.motelId], references: [motels.id] }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  motel: one(motels, { fields: [bookings.motelId], references: [motels.id] }),
  room: one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
  guest: one(guests, { fields: [bookings.guestId], references: [guests.id] }),
}));

export const userInsertSchema = createInsertSchema(users);
export const motelInsertSchema = createInsertSchema(motels);
export const roomInsertSchema = createInsertSchema(rooms);
export const guestInsertSchema = createInsertSchema(guests);
export const bookingInsertSchema = createInsertSchema(bookings);
export const userMotelInsertSchema = createInsertSchema(userMotels);
