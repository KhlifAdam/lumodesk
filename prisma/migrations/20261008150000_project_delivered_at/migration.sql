-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "delivered_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "projects_photographer_id_created_at_idx" ON "projects"("photographer_id", "created_at");


-- Projects already delivered get the best date we have.
UPDATE "projects" SET "delivered_at" = "updated_at" WHERE "stage" = 'DELIVERY';
