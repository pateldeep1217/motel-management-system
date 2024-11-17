-- Add the column as nullable first
ALTER TABLE "bookings" ADD COLUMN "payment_method" text;

-- Populate existing rows with a default value (e.g., 'Card')
UPDATE "bookings" SET "payment_method" = 'Card';

-- Set the column to NOT NULL
ALTER TABLE "bookings" ALTER COLUMN "payment_method" SET NOT NULL;
