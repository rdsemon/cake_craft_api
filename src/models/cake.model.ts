import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const cakeTable = pgTable("cakes", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 250 }).notNull(),

  description: varchar("description", { length: 1000 }).notNull(),

  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  quantity: integer("quantity").default(1).notNull(),

  inStock: integer("in_stock").default(1).notNull(),

  isAvailable: boolean("is_available").default(true).notNull(),

  coverImage: varchar("cover_image", { length: 500 })
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
    .$onUpdate(() => new Date())
    .notNull(),
});

export default cakeTable;
