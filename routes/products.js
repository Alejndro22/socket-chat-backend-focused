import { Router } from 'express';
import { check, query } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/products.js';
import {
  categoryExistsById,
  productExistsById,
  productRegistered,
} from '../helpers/db-validators.js';
import {
  isAdminRole,
  validateFields,
  validateJWT,
} from '../middlewares/index.js';

const router = Router();

// Get all products - public
router.get(
  '/',
  [
    query('limit', 'Limit value must be a number').isNumeric().optional(),
    query('from', 'From value must be a number').isNumeric().optional(),
    validateFields,
  ],
  getProducts
);

// Get product by Id - public
router.get(
  '/:id',
  [
    check('id', 'This is not a valid id').isMongoId(),
    check('id').custom(productExistsById),
    validateFields,
  ],
  getProduct
);

// Add new product - private (any role with valid token)
router.post(
  '/',
  [
    validateJWT,
    check('name', 'You must send a name').notEmpty(),
    check('name').custom(productRegistered),
    check('category', 'You must send a category').notEmpty(),
    check('category', 'This is not a valid id').isMongoId(),
    check('category').custom(categoryExistsById),
    validateFields,
  ],
  createProduct
);

// Update product by Id - private (any role with valid token)
router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'This is not a valid id').isMongoId(),
    check('id').custom(productExistsById),
    check('name').custom(productRegistered),
    check('category').custom(categoryExistsById).optional(),
    validateFields,
  ],
  updateProduct
);

// Delete product by Id - private (only if ADMIN_ROLE)
router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'This is not a valid id').isMongoId(),
    check('id').custom(productExistsById),
    validateFields,
  ],
  deleteProduct
);

export { router as productsRouter };
