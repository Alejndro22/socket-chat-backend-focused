import { Router } from 'express';
import { check, query } from 'express-validator';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers/categories.js';
import {
  categoryExistsById,
  categoryRegistered,
} from '../helpers/db-validators.js';
import {
  isAdminRole,
  validateFields,
  validateJWT,
} from '../middlewares/index.js';

const router = Router();

// Get all categories - public
router.get(
  '/',
  [
    query('limit', 'Limit value must be a number').isNumeric().optional(),
    query('from', 'From value must be a number').isNumeric().optional(),
    validateFields,
  ],
  getCategories
);

// Get category by Id - public
router.get(
  '/:id',
  [
    check('id', 'This is not a valid id').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields,
  ],
  getCategory
);

// Add new category - private (any role with valid token)
router.post(
  '/',
  [
    validateJWT,
    check('name', 'You must send a name').notEmpty(),
    check('name').custom(categoryRegistered),
    validateFields,
  ],
  createCategory
);

// Update category by Id - private (any role with valid token)
router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'This is not a valid id').isMongoId(),
    check('id').custom(categoryExistsById),
    check('name', 'You must send a name').notEmpty(),
    check('name').custom(categoryRegistered),
    validateFields,
  ],
  updateCategory
);

// Delete category by Id - private (only if ADMIN_ROLE)
router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'This is not a valid id').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields,
  ],
  deleteCategory
);

export { router as categoriesRouter };
