import { Router } from 'express';
import { UsersController } from './users.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import { updateUserSchema } from './users.validation';

const router = Router();

router.get('/:id', authenticate, UsersController.getUser);
router.put('/:id', authenticate, validate(updateUserSchema), UsersController.updateUser);
router.delete('/:id', authenticate, UsersController.deleteUser);
router.post('/:id/upload-avatar', authenticate, upload.single('avatar'), UsersController.uploadAvatar);

export default router;
