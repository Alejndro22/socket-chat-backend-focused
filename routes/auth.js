import { Router } from 'express';
import { check, query } from 'express-validator';
import { googleSignIn, login } from '../controllers/auth.js';
import { validateFields } from '../middlewares/validate-fields.js';

const router = Router();

router.post(
  '/login',
  [
    check('email', 'You must send an email').isEmail(),
    check('password', 'You must send a password').notEmpty(),
    validateFields,
  ],
  login
);

router.post(
  '/google',
  [check('id_token', 'You must send id_token').notEmpty(), validateFields],
  googleSignIn
);

export { router as authRouter };
