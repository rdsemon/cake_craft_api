import {
  pgTable,
  varchar,
  uuid,
  pgEnum,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

const userEnum = pgEnum("user_roles", ["customer", "admin"]);

const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 23 }).notNull(),
  role: userEnum("role").notNull().default("customer"),
  email: varchar("email", { length: 150 }).notNull().unique(),
  image: varchar("image", { length: 500 })
    .$type<string>()
    .default(
      "https://res.cloudinary.com/dz6gmlrjf/image/upload/v1778598812/847969_eyatxx.png",
    ),
  publicId: text("public_id"),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export { usersTable, userEnum };
