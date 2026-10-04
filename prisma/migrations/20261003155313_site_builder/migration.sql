-- Renames camelCase auth columns to snake_case (preserving data) and adds the public-site models.
-- CreateEnum
CREATE TYPE "site_template" AS ENUM ('MINIMAL', 'EDITORIAL', 'BOLD');

-- CreateEnum
CREATE TYPE "font_pair" AS ENUM ('MODERN', 'CLASSIC', 'ELEGANT');

-- CreateEnum
CREATE TYPE "media_type" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "accounts" RENAME COLUMN "idToken" TO "id_token";

-- AlterTable
ALTER TABLE "sessions" RENAME COLUMN "impersonatedBy" TO "impersonated_by";

-- AlterTable
ALTER TABLE "users" RENAME COLUMN "banExpires" TO "ban_expires";
ALTER TABLE "users" RENAME COLUMN "banReason" TO "ban_reason";

-- Data: accounts created before roles existed default to photographer
UPDATE "users" SET "role" = 'photographer' WHERE "role" IS NULL OR "role" = 'user';

-- CreateTable
CREATE TABLE "studios" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "socials" JSONB NOT NULL DEFAULT '{}',
    "logo_media_id" TEXT,
    "cover_media_id" TEXT,
    "template" "site_template" NOT NULL DEFAULT 'MINIMAL',
    "accent_color" TEXT NOT NULL DEFAULT '#c8a96e',
    "font_pair" "font_pair" NOT NULL DEFAULT 'MODERN',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "booking_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "type" "media_type" NOT NULL,
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration_sec" DOUBLE PRECISION,
    "alt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "cover_media_id" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_items" (
    "album_id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "album_items_pkey" PRIMARY KEY ("album_id","media_id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TND',
    "duration_minutes" INTEGER,
    "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cover_media_id" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "studios_photographer_id_key" ON "studios"("photographer_id");

-- CreateIndex
CREATE UNIQUE INDEX "studios_slug_key" ON "studios"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "media_key_key" ON "media"("key");

-- CreateIndex
CREATE INDEX "media_photographer_id_created_at_idx" ON "media"("photographer_id", "created_at");

-- CreateIndex
CREATE INDEX "albums_photographer_id_position_idx" ON "albums"("photographer_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "albums_photographer_id_slug_key" ON "albums"("photographer_id", "slug");

-- CreateIndex
CREATE INDEX "album_items_album_id_position_idx" ON "album_items"("album_id", "position");

-- CreateIndex
CREATE INDEX "packages_photographer_id_position_idx" ON "packages"("photographer_id", "position");

-- AddForeignKey
ALTER TABLE "studios" ADD CONSTRAINT "studios_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studios" ADD CONSTRAINT "studios_logo_media_id_fkey" FOREIGN KEY ("logo_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studios" ADD CONSTRAINT "studios_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_items" ADD CONSTRAINT "album_items_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_items" ADD CONSTRAINT "album_items_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
