import {
  pgTable,
  uuid,
  integer,
  timestamp,
  primaryKey,
  numeric,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user.model.js";
import cakeTable from "./cake.model.js";

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    cartId: uuid("cart_id")
      .references(() => carts.id, {
        onDelete: "cascade",
      })
      .notNull(),

    cakeId: uuid("cake_id")
      .references(() => cakeTable.id, {
        onDelete: "cascade",
      })
      .notNull(),

    quantity: integer("quantity").default(1).notNull(),

    price: numeric("price", { precision: 10, scale: 2, mode: "number" }),

    createdAt: timestamp("created_at").defaultNow(),
  },

  (table) => [
    primaryKey({
      columns: [table.cartId, table.cakeId],
    }),
  ],
);
