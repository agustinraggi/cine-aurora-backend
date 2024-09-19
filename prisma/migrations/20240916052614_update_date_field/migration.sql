/*
  Warnings:

  - Made the column `date` on table `movietheater` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `movietheater` MODIFY `date` DATETIME(3) NOT NULL;
