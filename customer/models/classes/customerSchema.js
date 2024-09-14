import { EntitySchema } from "typeorm";
import { Customer } from "./customer.entity.js";

const customerSchema = new EntitySchema({
    name: "Customer",
    target: Customer,
    columns: {
        idUser: {
            type: "int", name: "idUser"
        },
        mail: {
            type: "varchar", name: "mail", unique: true, length: 50 
        },
        name: {
            type: "varchar",  name: "name", nullable: true, length: 50
        },
        surname:{
            type:"varchar",  name: "surname", nullable: true, length: 50 
        },
        dni:{
            type: "int",  name: "dni", unique: true
        },
        date: {
            type:"varchar", name: "date", nullable: true, length: 25 
        },
        age: {
            type: "int",  name: "age", nullable: true
        },
        password: {
            type: "varchar",  name: "password", length: 255 
        },
        tips: {
            type:"varchar", 
            name: "tips",
            nullable: true,
            length: 25,
            default: () => "'cliente'",
        }
    } 
});

export default customerSchema;
