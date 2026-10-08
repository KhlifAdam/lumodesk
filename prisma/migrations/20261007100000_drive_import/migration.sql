-- CreateEnum
CREATE TYPE "drive_import_status" AS ENUM ('PENDING', 'RUNNING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "gallery_items" ADD COLUMN     "drive_file_id" TEXT;

-- CreateTable
CREATE TABLE "drive_imports" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "gallery_id" TEXT NOT NULL,
    "status" "drive_import_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drive_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drive_import_items" (
    "id" TEXT NOT NULL,
    "import_id" TEXT NOT NULL,
    "drive_file_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "status" "drive_import_status" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drive_import_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "drive_imports_photographer_id_created_at_idx" ON "drive_imports"("photographer_id", "created_at");

-- CreateIndex
CREATE INDEX "drive_imports_gallery_id_idx" ON "drive_imports"("gallery_id");

-- CreateIndex
CREATE INDEX "drive_import_items_import_id_status_idx" ON "drive_import_items"("import_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "drive_import_items_import_id_drive_file_id_key" ON "drive_import_items"("import_id", "drive_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_items_gallery_id_drive_file_id_key" ON "gallery_items"("gallery_id", "drive_file_id");

-- AddForeignKey
ALTER TABLE "drive_imports" ADD CONSTRAINT "drive_imports_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drive_imports" ADD CONSTRAINT "drive_imports_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drive_import_items" ADD CONSTRAINT "drive_import_items_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "drive_imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

