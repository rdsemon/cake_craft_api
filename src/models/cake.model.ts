import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  text,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const cakeTable = pgTable(
  "cakes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 250 }).notNull(),

    description: varchar("description", { length: 1000 }).notNull(),

    price: numeric("price", {
      precision: 10,
      scale: 2,
    }).notNull(),

    quantity: integer("quantity").default(1).notNull(),

    image: varchar("image", { length: 500 })
      .$type<string | null>()
      .default(null),

    publicId: text("public_id"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("price_positive", sql`${table.price} > 0`),
    check("quantity_positive", sql`${table.quantity} >= 0`),
  ],
);

export default cakeTable;
