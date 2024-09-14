import { Router } from 'express';
import CustomerController from '../customer/controller/customer.controller.js'; 

const router = Router();
const customerController = new CustomerController();

router.get('/:idUser', (req, res) => customerController.getById(req, res));

export default router;
