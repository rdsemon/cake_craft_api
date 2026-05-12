import { pgTable, uuid, varchar, numeric } from "drizzle-orm/pg-core";

export const cakeTable = pgTable("cakes", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 250 }).notNull(),

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});

export default cakeTable;
