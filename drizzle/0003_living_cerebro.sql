CREATE TABLE "cakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(250) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"in_stock" integer DEFAULT 1 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"cover_image" varchar(500) DEFAULT null,
	"public_id" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image" SET DEFAULT 'https://res.cloudinary.com/dz6gmlrjf/image/upload/v1778598812/847969_eyatxx.png';--> statement-breakpoint
ALTER TABLE "cakes" ADD CONSTRAINT "cakes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;