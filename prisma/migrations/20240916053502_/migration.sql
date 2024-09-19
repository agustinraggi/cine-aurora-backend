/*
  Warnings:

  - You are about to alter the column `finalPrice` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.
  - Made the column `date` on table `ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `movietheater` MODIFY `date` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ticket` MODIFY `finalPrice` DOUBLE NOT NULL,
    MODIFY `date` DATETIME(3) NOT NULL;
