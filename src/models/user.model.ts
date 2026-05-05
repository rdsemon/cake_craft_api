import { pgTable, varchar, uuid, pgEnum, timestamp } from "drizzle-orm/pg-core";

const userEnum = pgEnum("user_roles", ["customer", "admin"]);

const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 23 }).notNull(),
  role: userEnum("role").notNull().default("customer"),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export { usersTable, userEnum };
