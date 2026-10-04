-- CreateEnum
CREATE TYPE "theme_mode" AS ENUM ('LIGHT', 'DARK', 'BOTH');

-- AlterTable
ALTER TABLE "studios" ADD COLUMN     "default_locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "locales" TEXT[] DEFAULT ARRAY['en']::TEXT[],
ADD COLUMN     "theme_mode" "theme_mode" NOT NULL DEFAULT 'BOTH';
