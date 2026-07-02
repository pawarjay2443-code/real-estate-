import { Router } from 'express';
import { InquiriesController } from './inquiries.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import {
  createInquirySchema,
  updateInquiryStatusSchema,
  getPropertyInquiriesSchema,
} from './inquiries.validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createInquirySchema), InquiriesController.createInquiry);
router.get('/my', InquiriesController.myInquiries);
router.get('/property/:propertyId', validate(getPropertyInquiriesSchema), InquiriesController.propertyInquiries);
router.patch('/:id/status', validate(updateInquiryStatusSchema), InquiriesController.updateInquiryStatus);

export default router;
