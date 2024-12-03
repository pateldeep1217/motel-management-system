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
import { z } from "zod";

export const PaymentMethodEnum = pgEnum("payment_method", ["Card", "Cash"]);

// User Roles Table
export const userRoles = pgTable("user_roles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Room Statuses Table
export const roomStatuses = pgTable("room_statuses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Booking Statuses Table
export const bookingStatuses = pgTable("booking_statuses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Users Table
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions Table (for managing user sessions)
export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
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

export const motels = pgTable("motels", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  motelId: text("motel_id").references(() => motels.id, {
    onDelete: "cascade",
  }),
  number: text("number").notNull(),
  type: text("type").notNull(),
  capacity: integer("capacity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  statusId: text("status_id").references(() => roomStatuses.id, {
    onDelete: "cascade",
  }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const guests = pgTable("guests", {
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
  doNotRent: boolean("do_not_rent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
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
  checkInDate: timestamp("check_in", { mode: "date" }).notNull(),
  checkOutDate: timestamp("check_out", { mode: "date" }).notNull(),
  bookingStatusId: text("booking_status_id")
    .notNull()
    .references(() => bookingStatuses.id, { onDelete: "cascade" }),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  dailyRate: numeric("daily_rate", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: PaymentMethodEnum("payment_method").notNull(),
  pendingAmount: numeric("pending_amount", { precision: 10, scale: 2 }),
  paymentDueDate: timestamp("payment_due_date", { mode: "date" }),
  paidAmount: numeric("paid_amount", { precision: 10, scale: 2 }),

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
    roleId: text("role_id").references(() => userRoles.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (userMotels) => ({
    compositePk: primaryKey({
      columns: [userMotels.userId, userMotels.motelId],
    }),
  })
);

// Relations Setup
export const usersRelations = relations(users, ({ many }) => ({
  motels: many(userMotels),
}));

export const motelsRelations = relations(motels, ({ many }) => ({
  users: many(userMotels),
  rooms: many(rooms),
  guests: many(guests),
  bookings: many(bookings),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  motel: one(motels, { fields: [rooms.motelId], references: [motels.id] }),
  status: one(roomStatuses, {
    fields: [rooms.statusId],
    references: [roomStatuses.id],
  }),
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
  status: one(bookingStatuses, {
    fields: [bookings.bookingStatusId],
    references: [bookingStatuses.id],
  }),
}));

export const roomStatusesRelations = relations(roomStatuses, ({ many }) => ({
  rooms: many(rooms),
}));

export const bookingStatusesRelations = relations(
  bookingStatuses,
  ({ many }) => ({
    bookings: many(bookings),
  })
);

// Insert Schemas for Validation
export const userInsertSchema = createInsertSchema(users);
export const motelInsertSchema = createInsertSchema(motels);
export const roomInsertSchema = createInsertSchema(rooms);
export const guestInsertSchema = createInsertSchema(guests);
export const guestNameAndIdProofSchema = guestInsertSchema.pick({
  name: true,
  idProof: true,
});
export const bookingInsertSchema = createInsertSchema(bookings, {
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
});
export const bookingWithGuestInsertSchema = bookingInsertSchema.merge(
  guestNameAndIdProofSchema
);

export const userMotelInsertSchema = createInsertSchema(userMotels);
