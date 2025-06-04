import express from 'express';
import { getBookings, createBooking, deleteBooking } from '../controllers/bookingController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", protect, getBookings);
router.post('/', protect, createBooking); 
router.delete('/:id', protect, deleteBooking);



export default router;
