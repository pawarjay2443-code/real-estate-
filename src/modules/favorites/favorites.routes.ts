import { Router } from 'express';
import { FavoritesController } from './favorites.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/my', FavoritesController.myFavorites);
router.post('/:propertyId', FavoritesController.addFavorite);
router.delete('/:propertyId', FavoritesController.removeFavorite);

export default router;
