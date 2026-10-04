-- CreateEnum
CREATE TYPE "project_stage" AS ENUM ('BOOKING', 'PREP', 'SHOOTING', 'IMPORT', 'ORGANIZATION', 'SELECTION', 'POST_PRODUCTION', 'EXPORT', 'VALIDATION', 'DELIVERY');

-- CreateTable
CREATE TABLE "studio_clients" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "studio_client_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMP(3),
    "location" TEXT,
    "stage" "project_stage" NOT NULL DEFAULT 'BOOKING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "selection_enabled" BOOLEAN NOT NULL DEFAULT true,
    "selection_limit" INTEGER,
    "shared_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" TEXT NOT NULL,
    "gallery_id" TEXT NOT NULL,
    "photographer_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "preview_key" TEXT,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_comments" (
    "id" TEXT NOT NULL,
    "gallery_item_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "studio_clients_client_id_idx" ON "studio_clients"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "studio_clients_photographer_id_client_id_key" ON "studio_clients"("photographer_id", "client_id");

-- CreateIndex
CREATE INDEX "projects_photographer_id_stage_updated_at_idx" ON "projects"("photographer_id", "stage", "updated_at");

-- CreateIndex
CREATE INDEX "projects_studio_client_id_updated_at_idx" ON "projects"("studio_client_id", "updated_at");

-- CreateIndex
CREATE INDEX "galleries_project_id_position_idx" ON "galleries"("project_id", "position");

-- CreateIndex
CREATE INDEX "galleries_photographer_id_idx" ON "galleries"("photographer_id");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_items_key_key" ON "gallery_items"("key");

-- CreateIndex
CREATE INDEX "gallery_items_gallery_id_position_idx" ON "gallery_items"("gallery_id", "position");

-- CreateIndex
CREATE INDEX "gallery_items_gallery_id_selected_idx" ON "gallery_items"("gallery_id", "selected");

-- CreateIndex
CREATE INDEX "gallery_comments_gallery_item_id_created_at_idx" ON "gallery_comments"("gallery_item_id", "created_at");

-- AddForeignKey
ALTER TABLE "studio_clients" ADD CONSTRAINT "studio_clients_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studio_clients" ADD CONSTRAINT "studio_clients_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_studio_client_id_fkey" FOREIGN KEY ("studio_client_id") REFERENCES "studio_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_comments" ADD CONSTRAINT "gallery_comments_gallery_item_id_fkey" FOREIGN KEY ("gallery_item_id") REFERENCES "gallery_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_comments" ADD CONSTRAINT "gallery_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
