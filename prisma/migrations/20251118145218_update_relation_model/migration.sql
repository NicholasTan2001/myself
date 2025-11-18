/*
  Warnings:

  - You are about to drop the column `friendID` on the `relation` table. All the data in the column will be lost.
  - Added the required column `friendId` to the `Relation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailylist` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `record` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `relation` DROP COLUMN `friendID`,
    ADD COLUMN `friendId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `speciallist` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `createdAt` DROP DEFAULT;
