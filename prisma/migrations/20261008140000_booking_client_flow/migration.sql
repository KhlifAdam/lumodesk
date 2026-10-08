-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "booking_activity_kind" ADD VALUE 'SENT';
ALTER TYPE "booking_activity_kind" ADD VALUE 'CLIENT_EDIT';
ALTER TYPE "booking_activity_kind" ADD VALUE 'CLIENT_ACCEPT';
ALTER TYPE "booking_activity_kind" ADD VALUE 'CLIENT_DECLINE';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "client_accepted_at" TIMESTAMP(3),
ADD COLUMN     "sent_to_client_at" TIMESTAMP(3);

