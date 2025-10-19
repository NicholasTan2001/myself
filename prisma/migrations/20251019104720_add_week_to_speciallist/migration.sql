/*
  Warnings:

  - Added the required column `week` to the `SpecialList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `speciallist` ADD COLUMN `week` VARCHAR(191) NOT NULL;
