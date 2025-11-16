-- AlterTable
ALTER TABLE `dailylist` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `record` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `speciallist` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `createdAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Note` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `important` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
