import * as path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

const dfltExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadFile = (files, validExtensions = dfltExtensions, folder = '') => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    if (!validExtensions.includes(file.mimetype)) {
      return reject(`Only ${validExtensions.join(', ')} are accepted`);
    }

    const storageName = uuidv4() + '.' + mime.extension(file.mimetype);
    const uploadPath = path.join(__dirname, '../uploads/', folder, storageName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(storageName);
    });
  });
};

export { uploadFile };
