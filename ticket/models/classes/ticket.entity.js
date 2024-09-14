import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customer } from "./Customer";

@Index("idUser", ["idUser"], {})
@Entity("ticket", { schema: "cine-aurora" })
export class Ticket {
  @PrimaryGeneratedColumn({ type: "int", name: "idTicket" })
  idTicket;

  @Column("varchar", { name: "nameFilm", nullable: true, length: 50 })
  nameFilm;

  @Column("varchar", { name: "chair", nullable: true, length: 255 })
  chair;

  @Column("decimal", {
    name: "finalPrice",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  finalPrice;

  @Column("varchar", { name: "date", nullable: true, length: 50 })
  date;

  @Column("varchar", { name: "time", nullable: true, length: 50 })
  time;

  @Column("varchar", { name: "typeOfFunction", nullable: true, length: 50 })
  typeOfFunction;

  @Column("varchar", { name: "language", nullable: true, length: 50 })
  language;

  @Column("varchar", { name: "voucher", nullable: true, length: 100 })
  voucher;

  @Column("int", { name: "idUser", nullable: true })
  idUser;

  @Column("datetime", {
    name: "purchaseDate",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  purchaseDate;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["pending", "paid", "canceled"],
    default: () => "'pending'",
  })
  status;

  @ManyToOne(() => Customer, (customer) => customer.tickets, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "idUser", referencedColumnName: "idUser" }])
  idUser2;
}
