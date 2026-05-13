import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";

export const cakeTable = pgTable("cakes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 250 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1),
  image: varchar("image", { length: 500 }).$type<string | null>().default(null),
  publicId: text("public_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export default cakeTable;
