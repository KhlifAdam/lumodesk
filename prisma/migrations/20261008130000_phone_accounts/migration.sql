-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "invite_phone" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "phone_number_verified" BOOLEAN;

-- CreateIndex
CREATE INDEX "projects_invite_phone_invite_status_idx" ON "projects"("invite_phone", "invite_status");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

