ALTER TABLE "rooms" 
ALTER COLUMN "price" TYPE numeric(10, 2) USING price::numeric(10, 2);