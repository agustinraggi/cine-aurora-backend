import {CustomerRepository} from '../repositories/custormer.repository.js'

export class CustomerService{
    async getById(idUser){
        const customerRepository = new CustomerRepository();
        const customer = await customerRepository.getById(idUser);
        return customer;
    }
}