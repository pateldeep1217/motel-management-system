import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const userRoleEnum = pgEnum("user_role", ["admin", "staff", "guest"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: userRoleEnum("role").notNull().default("guest"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
  twoFASecret: text("2fa_secret"),
  isTowFAEnabled: boolean("2fa_activated").default(false),
});

export const motels = pgTable("motels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  address: text("address"),
  ownerId: uuid("ownerId")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMotelSchema = createInsertSchema(motels);
