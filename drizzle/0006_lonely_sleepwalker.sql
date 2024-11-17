DO $$ BEGIN
    CREATE TYPE "public"."payment_method" AS ENUM('Card', 'Cash');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alter the column type with explicit casting
ALTER TABLE "bookings" ALTER COLUMN "payment_method" SET DATA TYPE payment_method USING payment_method::payment_method;
