import { Router } from 'express';
import { check, query } from 'express-validator';
import { getMessages, sendMessage } from '../controllers/chat.js';
import { validateFields, validateJWT } from '../middlewares/index.js';

const router = Router();

router.get(
  '/',
  [
    validateJWT,
    query('limit', 'Limit value must be a number').isNumeric().optional(),
    query('from', 'From value must be a number').isNumeric().optional(),
    validateFields,
  ],
  getMessages
);
router.post(
  '/',
  [
    validateJWT,
    check('unique_receiver', 'This is not a valid id').optional().isMongoId(),
    validateFields,
  ],
  sendMessage
);

export { router as chatRouter };
