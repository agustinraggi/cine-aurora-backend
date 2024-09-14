import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("movietheater", { schema: "cine-aurora" })
export class Movietheater {
  @PrimaryGeneratedColumn({ type: "int", name: "idMovieTheater" })
  idMovieTheater;

  @Column("int", { name: "codeFilm", nullable: true })
  codeFilm;

  @Column("varchar", { name: "nameFilm", nullable: true, length: 50 })
  nameFilm;

  @Column("varchar", { name: "date", nullable: true, length: 50 })
  date;

  @Column("varchar", { name: "time", nullable: true, length: 50 })
  time;

  @Column("varchar", { name: "typeOfFunction", nullable: true, length: 50 })
  typeOfFunction;

  @Column("varchar", { name: "language", nullable: true, length: 50 })
  language;

  @Column("int", { name: "price", nullable: true })
  price;
}
