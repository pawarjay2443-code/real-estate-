import { Router } from 'express';
import { PropertiesController } from './properties.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import {
  createPropertySchema,
  updatePropertySchema,
  updatePropertyStatusSchema,
  listPropertiesQuerySchema,
  geoSearchQuerySchema,
} from './properties.validation';

const router = Router();

// Search routes must be placed before parameterized routes
router.get('/search', PropertiesController.searchProperties);
router.get('/nearby', validate(geoSearchQuerySchema), PropertiesController.nearbyProperties);

router.get('/', validate(listPropertiesQuerySchema), PropertiesController.listProperties);
router.post('/', authenticate, validate(createPropertySchema), PropertiesController.createProperty);

router.get('/:id', PropertiesController.getProperty);
router.put('/:id', authenticate, validate(updatePropertySchema), PropertiesController.updateProperty);
router.delete('/:id', authenticate, PropertiesController.deleteProperty);

router.post('/:id/images', authenticate, upload.array('images', 10), PropertiesController.uploadImages);
router.delete('/:id/images/:imageId', authenticate, PropertiesController.deleteImage);

router.patch('/:id/status', authenticate, validate(updatePropertyStatusSchema), PropertiesController.updateStatus);

export default router;
