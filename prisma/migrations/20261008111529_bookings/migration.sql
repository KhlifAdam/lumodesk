-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('NEW', 'DISCUSSION', 'QUOTE_SENT', 'CONFIRMED', 'DECLINED');

-- CreateEnum
CREATE TYPE "booking_source" AS ENUM ('INSTAGRAM', 'WHATSAPP', 'PHONE', 'WEBSITE', 'OTHER');

-- CreateEnum
CREATE TYPE "booking_activity_kind" AS ENUM ('CREATED', 'STATUS', 'NOTE');

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "client_id" TEXT,
    "project_id" TEXT,
    "title" TEXT NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'NEW',
    "source" "booking_source" NOT NULL DEFAULT 'OTHER',
    "client_name" TEXT NOT NULL,
    "client_email" TEXT,
    "client_phone" TEXT,
    "service_type" "project_service_type" NOT NULL DEFAULT 'OTHER',
    "media_type" "project_media_type" NOT NULL DEFAULT 'PHOTO',
    "description" TEXT,
    "desired_date" TIMESTAMP(3),
    "start_time" TEXT,
    "duration_minutes" INTEGER,
    "location" TEXT,
    "client_budget" DECIMAL(12,3),
    "proposed_price" DECIMAL(12,3),
    "planned_advance" DECIMAL(12,3),
    "response_deadline" TIMESTAMP(3),
    "internal_notes" TEXT,
    "status_reason" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_activities" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "kind" "booking_activity_kind" NOT NULL,
    "from_status" "booking_status",
    "to_status" "booking_status",
    "body" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_project_id_key" ON "bookings"("project_id");

-- CreateIndex
CREATE INDEX "bookings_photographer_id_status_desired_date_idx" ON "bookings"("photographer_id", "status", "desired_date");

-- CreateIndex
CREATE INDEX "bookings_photographer_id_created_at_idx" ON "bookings"("photographer_id", "created_at");

-- CreateIndex
CREATE INDEX "bookings_client_id_idx" ON "bookings"("client_id");

-- CreateIndex
CREATE INDEX "booking_activities_booking_id_created_at_idx" ON "booking_activities"("booking_id", "created_at");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_activities" ADD CONSTRAINT "booking_activities_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
