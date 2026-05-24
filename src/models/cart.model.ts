import {
  pgTable,
  uuid,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user.model";
import cakeTable from "./cake.model";

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

    price: integer("price").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
  },

  (table) => [
    primaryKey({
      columns: [table.cartId, table.cakeId],
    }),
  ],
);
