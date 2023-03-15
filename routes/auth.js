import { Router } from 'express';
import { check, query } from 'express-validator';
import { googleSignIn, login, renewToken } from '../controllers/auth.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';

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

router.get('/', validateJWT, renewToken);
export { router as authRouter };
