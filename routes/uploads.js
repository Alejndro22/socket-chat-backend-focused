import { Router } from 'express';
import { check } from 'express-validator';
import {
  showImage,
  updateImageCloudinary,
  upload,
} from '../controllers/uploads.js';
import { allowedCollections } from '../helpers/index.js';
import { validateFields, validateFileToUpload } from '../middlewares/index.js';

const router = Router();

router.post('/', validateFileToUpload, upload);

router.put(
  '/:collection/:id',
  [
    validateFileToUpload,
    check('id', 'This is not a valid id').isMongoId(),
    check('collection').custom((collection) =>
      allowedCollections(collection, ['users', 'products'])
    ),
    validateFields,
  ],
  updateImageCloudinary
);

router.get(
  '/:collection/:id',
  [
    check('id', 'This is not a valid id').isMongoId(),
    check('collection').custom((collection) =>
      allowedCollections(collection, ['users', 'products'])
    ),
    validateFields,
  ],
  showImage
);

export { router as uploadsRouter };
