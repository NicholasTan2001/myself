/*
  Warnings:

  - Added the required column `name` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remark` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `record` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `remark` VARCHAR(191) NOT NULL;
