import { Router } from 'express';
import { check, query } from 'express-validator';

import {
  validateFields,
  validateJWT,
  hasExpectedRole,
  isAdminRole,
} from '../middlewares/index.js';

import {
  isValidRole,
  isRegistered,
  userExistsById,
} from '../helpers/db-validators.js';

import {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
} from '../controllers/users.js';

const router = Router();

router.get(
  '/',
  [
    query('limit', 'Limit value must be a number').isNumeric().optional(),
    query('from', 'From value must be a number').isNumeric().optional(),
    validateFields,
  ],
  getUsers
);

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check(
      'password',
      'Password is required and must contain at least 6 chars'
    ).isLength({ min: 6 }),
    check('email', 'This is not a valid email').isEmail(),
    check('email').custom(isRegistered),
    // check('role', 'Role not valid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    validateFields,
  ],
  postUsers
);

// Parámetros de segmento
router.put(
  '/:id',
  [
    check('id', 'This is not a valid id').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isValidRole),
    validateFields,
  ],
  putUsers
);

router.patch('/', patchUsers);

router.delete(
  '/:id',
  [
    validateJWT,
    // isAdminRole,
    hasExpectedRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'This is not a valid id').isMongoId(),
    check('id').custom(userExistsById),
    validateFields,
  ],
  deleteUsers
);

export { router as userRouter };
