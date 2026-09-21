/*
  Warnings:

  - You are about to drop the column `user_id_on_provider` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "user_id_on_provider";
