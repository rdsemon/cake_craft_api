import {
  pgTable,
  uuid,
  timestamp,
  numeric,
  varchar,
  text,
  integer,
} from "drizzle-orm/pg-core";

import { usersTable } from "../models/user.model.js";
import { cakeTable } from "../models/cake.model.js";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),

  totalAmount: numeric("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  status: varchar("status", {
    length: 20,
  })
    .default("pending")
    .notNull(),

  recipientName: varchar("recipient_name", {
    length: 255,
  }).notNull(),

  phone: varchar("phone", {
    length: 20,
  }).notNull(),

  address: text("address").notNull(),

  city: varchar("city", {
    length: 100,
  }).notNull(),

  postalCode: varchar("postal_code", {
    length: 20,
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .references(() => orders.id, {
      onDelete: "cascade",
    })
    .notNull(),

  cakeId: uuid("cake_id")
    .references(() => cakeTable.id)
    .notNull(),

  quantity: integer("quantity").notNull(),

  unitPrice: numeric("unit_price", {
    precision: 10,
    scale: 2,
    mode: "number",
  }).notNull(),

  subtotal: numeric("subtotal", {
    precision: 10,
    scale: 2,
    mode: "number",
  }).notNull(),
});
