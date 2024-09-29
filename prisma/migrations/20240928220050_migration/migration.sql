-- AlterTable
ALTER TABLE `ticket` MODIFY `status` ENUM('pending', 'paid', 'used', 'canceled') NOT NULL DEFAULT 'pending';
