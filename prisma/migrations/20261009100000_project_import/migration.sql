-- AlterTable
ALTER TABLE "gallery_items" ADD COLUMN     "duration_sec" DOUBLE PRECISION,
ADD COLUMN     "type" "media_type" NOT NULL DEFAULT 'IMAGE',
ALTER COLUMN "size" SET DATA TYPE BIGINT;

-- CreateTable
CREATE TABLE "upload_sessions" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "gallery_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "upload_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "part_size" INTEGER NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upload_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "upload_sessions_key_key" ON "upload_sessions"("key");

-- CreateIndex
CREATE INDEX "upload_sessions_photographer_id_gallery_id_idx" ON "upload_sessions"("photographer_id", "gallery_id");

-- CreateIndex
CREATE UNIQUE INDEX "upload_sessions_gallery_id_fingerprint_key" ON "upload_sessions"("gallery_id", "fingerprint");

-- AddForeignKey
ALTER TABLE "upload_sessions" ADD CONSTRAINT "upload_sessions_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upload_sessions" ADD CONSTRAINT "upload_sessions_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

