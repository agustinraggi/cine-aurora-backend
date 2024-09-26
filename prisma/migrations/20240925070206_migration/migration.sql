/*
  Warnings:

  - You are about to drop the column `idMovieTheater` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `numberSeats` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `idSeat` on the `ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `seats` DROP FOREIGN KEY `Seats_idMovieTheater_fkey`;

-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_idSeat_fkey`;

-- AlterTable
ALTER TABLE `seats` DROP COLUMN `idMovieTheater`,
    DROP COLUMN `numberSeats`,
    DROP COLUMN `status`,
    ADD COLUMN `chair` VARCHAR(191) NULL,
    ADD COLUMN `statuSeats` ENUM('free', 'buys') NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `ticket` DROP COLUMN `idSeat`,
    ADD COLUMN `idMovieTheater` INTEGER NULL;
