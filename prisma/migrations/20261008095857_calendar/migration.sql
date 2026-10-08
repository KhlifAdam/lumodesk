-- CreateEnum
CREATE TYPE "calendar_event_type" AS ENUM ('SHOOT', 'MEETING', 'AVAILABLE', 'UNAVAILABLE', 'OTHER');

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "project_id" TEXT,
    "type" "calendar_event_type" NOT NULL DEFAULT 'SHOOT',
    "title" TEXT NOT NULL,
    "all_day" BOOLEAN NOT NULL DEFAULT false,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "calendar_events_photographer_id_starts_at_idx" ON "calendar_events"("photographer_id", "starts_at");

-- CreateIndex
CREATE INDEX "calendar_events_photographer_id_ends_at_idx" ON "calendar_events"("photographer_id", "ends_at");

-- CreateIndex
CREATE INDEX "calendar_events_project_id_idx" ON "calendar_events"("project_id");

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
