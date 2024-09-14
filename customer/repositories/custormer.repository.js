import { Repository } from "typeorm";
import { Customer } from "../models/classes/customer.entity";
import { AppDataSource } from "../../app";

export class CustomerRepository{
    repository = AppDataSource.getRepository(Customer)
    
    async getById(id){
        return this.repository.findOneByOrFail({where: {idUser:id}})
    }
}