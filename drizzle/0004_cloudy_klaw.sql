CREATE TABLE "cart_items" (
	"cart_id" uuid NOT NULL,
	"cake_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cart_items_cart_id_cake_id_pk" PRIMARY KEY("cart_id","cake_id")
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cakes" DROP CONSTRAINT "cakes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cake_id_cakes_id_fk" FOREIGN KEY ("cake_id") REFERENCES "public"."cakes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cakes" ADD CONSTRAINT "cakes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;