-- CreateEnum
CREATE TYPE "project_service_type" AS ENUM ('WEDDING', 'ENGAGEMENT', 'BIRTHDAY', 'EVENT', 'PRODUCT', 'PORTRAIT', 'ADVERTISING', 'CORPORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "project_media_type" AS ENUM ('PHOTO', 'VIDEO', 'BOTH');

-- CreateEnum
CREATE TYPE "project_location_type" AS ENUM ('STUDIO', 'OUTDOOR', 'HOME', 'COMPANY', 'OTHER');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('UNPAID', 'PARTIAL', 'PAID');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "advance" DECIMAL(12,3) NOT NULL DEFAULT 0,
ADD COLUMN     "client_notes" TEXT,
ADD COLUMN     "client_phone" TEXT,
ADD COLUMN     "contact_name" TEXT,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "delivery_deadline" TIMESTAMP(3),
ADD COLUMN     "end_time" TEXT,
ADD COLUMN     "equipment" TEXT,
ADD COLUMN     "financial_notes" TEXT,
ADD COLUMN     "internal_notes" TEXT,
ADD COLUMN     "location_type" "project_location_type",
ADD COLUMN     "media_type" "project_media_type" NOT NULL DEFAULT 'PHOTO',
ADD COLUMN     "payment_status" "payment_status" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "price" DECIMAL(12,3),
ADD COLUMN     "service_type" "project_service_type" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "start_time" TEXT,
ADD COLUMN     "team" TEXT;

-- Carry the old paid flag over, then drop it.
UPDATE "projects" SET "payment_status" = 'PAID' WHERE "paid" = true;

ALTER TABLE "projects" DROP COLUMN "paid";
