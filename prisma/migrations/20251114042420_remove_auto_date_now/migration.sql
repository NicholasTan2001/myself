-- AlterTable
ALTER TABLE `dailylist` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `record` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `speciallist` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `createdAt` DROP DEFAULT;
