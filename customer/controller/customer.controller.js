import { CustomerService } from "../services/customer.service";

export class CustomerController{
    async getById (req, res){
        const idUser = req.params.idUser;
        const customerService = new CustomerService();
        const customer = await customerService.getById(idUser);
        return customer;
    }
}
