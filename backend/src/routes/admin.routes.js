import { Router } from 'express';
import { createRoom, updateRoom, deleteRoom, getAllBookingsAdmin } from '../controllers/admin.controller.js';

const router = Router();

router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.get('/bookings', getAllBookingsAdmin);

export default router;