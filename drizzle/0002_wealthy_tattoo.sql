ALTER TABLE "motel" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "state";--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "zip_code";--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "phone_number";--> statement-breakpoint
ALTER TABLE "motel" DROP COLUMN IF EXISTS "description";