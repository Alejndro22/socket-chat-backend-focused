import { Router } from 'express';
import { search, searchProductsByCategory } from '../controllers/search.js';

const router = Router();

router.get('/:collection/:query', search);

router.get('/products/category/:category', searchProductsByCategory);

export { router as searchRouter };
