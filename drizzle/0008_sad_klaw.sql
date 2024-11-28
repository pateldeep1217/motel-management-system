ALTER TABLE "bookings" ALTER COLUMN "pending_amount" DROP NOT NULL;
ALTER TABLE "bookings" ALTER COLUMN "payment_due_date" DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='paid_amount') THEN
        ALTER TABLE bookings ADD COLUMN paid_amount numeric;
    END IF;
END $$;
