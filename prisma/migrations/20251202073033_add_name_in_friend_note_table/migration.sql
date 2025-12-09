/*
  Warnings:

  - Added the required column `name` to the `FriendNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailylist` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `friendnote` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `record` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `speciallist` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `createdAt` DROP DEFAULT;
