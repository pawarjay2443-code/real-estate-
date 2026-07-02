import { Router } from 'express';
import { BookingsController } from './bookings.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { createBookingSchema, updateBookingSchema } from './bookings.validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createBookingSchema), BookingsController.createBooking);
router.get('/my', BookingsController.myBookings);
router.patch('/:id', validate(updateBookingSchema), BookingsController.updateBooking);

export default router;
