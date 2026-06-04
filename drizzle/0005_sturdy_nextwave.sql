ALTER TABLE "cart_items" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "cart_items" ALTER COLUMN "price" DROP NOT NULL;