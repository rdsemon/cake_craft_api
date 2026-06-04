import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";

import { usersTable } from "./user.model.js";
import cakeTable from "./cake.model.js";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),

  cakeId: uuid("cake_id")
    .notNull()
    .references(() => cakeTable.id),

  rating: integer("rating").notNull(),

  comment: text("comment"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
