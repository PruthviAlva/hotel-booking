import { Router } from 'express';
import { createBooking, mockPayment, getBookingsByCustomer, cancelBooking } from '../controllers/bookings.controller.js';

const router = Router();
router.post('/', createBooking);
router.post('/payment', mockPayment);
router.get('/customer/:customerId', getBookingsByCustomer);
router.patch('/:id/cancel', cancelBooking);

export default router;