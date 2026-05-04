-- Booking source + room inventory support.
CREATE TYPE "BookingSource" AS ENUM ('ONLINE', 'WALKIN');

ALTER TABLE "room_types"
  ADD COLUMN "totalCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

UPDATE "room_types"
SET
  "totalCount" = "totalRooms",
  "price" = "pricePerNight";

ALTER TABLE "room_types"
  DROP COLUMN "availableRooms";

ALTER TABLE "bookings"
  ADD COLUMN "roomId" TEXT,
  ADD COLUMN "guests" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "rooms" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "source" "BookingSource" NOT NULL DEFAULT 'ONLINE';

UPDATE "bookings"
SET "guests" = "guestCount";

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_roomId_fkey"
  FOREIGN KEY ("roomId") REFERENCES "room_types"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "bookings_roomId_checkIn_checkOut_status_idx"
  ON "bookings"("roomId", "checkIn", "checkOut", "status");
