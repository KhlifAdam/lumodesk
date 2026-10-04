-- CreateEnum
CREATE TYPE "invite_status" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_studio_client_id_fkey";

-- DropForeignKey
ALTER TABLE "studio_clients" DROP CONSTRAINT "studio_clients_client_id_fkey";

-- DropForeignKey
ALTER TABLE "studio_clients" DROP CONSTRAINT "studio_clients_photographer_id_fkey";

-- DropIndex
DROP INDEX "projects_studio_client_id_updated_at_idx";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "studio_client_id",
ADD COLUMN     "client_id" TEXT,
ADD COLUMN     "invite_email" TEXT,
ADD COLUMN     "invite_status" "invite_status",
ADD COLUMN     "invited_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "studio_clients";

-- CreateTable
CREATE TABLE "client_profiles" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "client_profiles_client_id_idx" ON "client_profiles"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "client_profiles_photographer_id_client_id_key" ON "client_profiles"("photographer_id", "client_id");

-- CreateIndex
CREATE INDEX "projects_client_id_updated_at_idx" ON "projects"("client_id", "updated_at");

-- CreateIndex
CREATE INDEX "projects_invite_email_invite_status_idx" ON "projects"("invite_email", "invite_status");

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

