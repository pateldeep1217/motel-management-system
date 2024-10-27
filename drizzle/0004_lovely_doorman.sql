DO $$ BEGIN
 CREATE TYPE "public"."booking_status" AS ENUM('confirmed', 'checked_in', 'checked_out', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."room_status" AS ENUM('available', 'occupied', 'maintenance', 'cleaning');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_motels" (
	"user_id" text NOT NULL,
	"motel_id" text NOT NULL,
	"role" "user_role" DEFAULT 'staff',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_motels_user_id_motel_id_pk" PRIMARY KEY("user_id","motel_id")
);
--> statement-breakpoint
ALTER TABLE "motel" DROP CONSTRAINT "motel_owner_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "status" "booking_status" DEFAULT 'confirmed';--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "total_amount" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ADD COLUMN "status" "room_status" DEFAULT 'available';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_motels" ADD CONSTRAINT "user_motels_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_motels" ADD CONSTRAINT "user_motels_motel_id_motel_id_fk" FOREIGN KEY ("motel_id") REFERENCES "public"."motel"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "owner_id";--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "state";--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "zip_code";--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "phone_number";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "role";