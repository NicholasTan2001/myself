/*
  Warnings:

  - You are about to drop the `record` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `record` DROP FOREIGN KEY `Record_userId_fkey`;

-- DropTable
DROP TABLE `record`;
