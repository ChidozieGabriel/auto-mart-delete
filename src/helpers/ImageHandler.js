import { v2 as cloudinary } from 'cloudinary';
import DataUri from 'datauri';
import multer from 'multer';

class ImageHandler {
  static configureStorage(...args) {
    multer({ storage: multer.memoryStorage() })
      .single('image')
      .apply(this, args);
  }

  static upload(req, res, next) {
    if (!req.file) {
      next();
      return;
    }

    const dataUri = new DataUri();
    const image = dataUri.format('.png', req.file.buffer).content;
    cloudinary.uploader
      .upload(image)
      .then((result) => {
        req.body.image_url = result.url;
        next();
      })
      .catch((err) => {
        next(err);
      });
  }
}

export default ImageHandler;
