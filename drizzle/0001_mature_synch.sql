ALTER TABLE "motel" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "motel" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "motel" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "motel" ADD COLUMN "zip_code" text;--> statement-breakpoint
ALTER TABLE "motel" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "motel" ADD COLUMN "description" text;