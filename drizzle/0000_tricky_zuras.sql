DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('admin', 'staff', 'guest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"ownerId" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'guest' NOT NULL,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"2fa_secret" text,
	"2fa_activated" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "motels" ADD CONSTRAINT "motels_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
