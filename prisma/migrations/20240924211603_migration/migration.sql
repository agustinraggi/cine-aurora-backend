-- CreateTable
CREATE TABLE `Customer` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `mail` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `surname` VARCHAR(191) NULL,
    `dni` INTEGER NOT NULL,
    `date` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `password` VARCHAR(191) NOT NULL,
    `tips` VARCHAR(191) NOT NULL DEFAULT 'cliente',

    UNIQUE INDEX `Customer_mail_key`(`mail`),
    UNIQUE INDEX `Customer_dni_key`(`dni`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `idTicket` INTEGER NOT NULL AUTO_INCREMENT,
    `nameFilm` VARCHAR(191) NULL,
    `chair` VARCHAR(191) NULL,
    `finalPrice` DOUBLE NOT NULL,
    `date` DATETIME(3) NULL,
    `time` VARCHAR(191) NULL,
    `typeOfFunction` VARCHAR(191) NULL,
    `language` VARCHAR(191) NULL,
    `voucher` VARCHAR(191) NULL,
    `idUser` INTEGER NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('pending', 'paid', 'canceled') NOT NULL DEFAULT 'pending',
    `idSeat` INTEGER NULL,

    UNIQUE INDEX `Ticket_idSeat_key`(`idSeat`),
    PRIMARY KEY (`idTicket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovieTheater` (
    `idMovieTheater` INTEGER NOT NULL AUTO_INCREMENT,
    `codeFilm` INTEGER NULL,
    `nameFilm` VARCHAR(191) NULL,
    `date` VARCHAR(191) NULL,
    `time` VARCHAR(191) NULL,
    `typeOfFunction` VARCHAR(191) NULL,
    `language` VARCHAR(191) NULL,
    `price` INTEGER NULL,

    PRIMARY KEY (`idMovieTheater`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seats` (
    `idSeats` INTEGER NOT NULL AUTO_INCREMENT,
    `idMovieTheater` INTEGER NOT NULL,
    `numberSeats` VARCHAR(191) NULL,
    `status` ENUM('free', 'occupied') NOT NULL DEFAULT 'free',

    PRIMARY KEY (`idSeats`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `Customer`(`idUser`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_idSeat_fkey` FOREIGN KEY (`idSeat`) REFERENCES `Seats`(`idSeats`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seats` ADD CONSTRAINT `Seats_idMovieTheater_fkey` FOREIGN KEY (`idMovieTheater`) REFERENCES `MovieTheater`(`idMovieTheater`) ON DELETE RESTRICT ON UPDATE CASCADE;
