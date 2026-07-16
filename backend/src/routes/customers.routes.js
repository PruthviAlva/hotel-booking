import { Router } from 'express';
import { createCustomer, getCustomerByEmail } from '../controllers/customers.controller.js';

const router = Router();
router.post('/', createCustomer);
router.get('/email/:email', getCustomerByEmail);

export default router;