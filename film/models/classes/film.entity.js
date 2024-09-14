import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("film", { schema: "cine-aurora" })
export class Film {
  @PrimaryGeneratedColumn({ type: "int", name: "idFilm" })
  idFilm;

  @Column("int", { name: "codeFilm", nullable: true })
  codeFilm;

  @Column("varchar", { name: "nameFilm", nullable: true, length: 50 })
  nameFilm;
}
