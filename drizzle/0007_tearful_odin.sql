ALTER TABLE "bookings" ADD COLUMN "pending_amount" numeric NOT NULL DEFAULT 0;
ALTER TABLE "bookings" ADD COLUMN "payment_due_date" timestamp NULL;
