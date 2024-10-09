-- CreateTable
CREATE TABLE `SoonFilm` (
    `idSoonFilm` INTEGER NOT NULL AUTO_INCREMENT,
    `codeFilm` INTEGER NULL,
    `nameFilm` VARCHAR(191) NULL,

    PRIMARY KEY (`idSoonFilm`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
