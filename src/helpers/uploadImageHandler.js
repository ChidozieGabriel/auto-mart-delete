import DataUri from "datauri";
import { v2 as cloudinary } from "cloudinary";

const uploadImageHandler = function uploadImageToCloudinary(req, res, next) {
  if (!req.file) {
    next();
    return;
  }

  const dataUri = new DataUri();
  const image = dataUri.format(".png", req.file.buffer).content;

  cloudinary.uploader
    .upload(image)
    .then(result => {
      req.body.image_url = result.url;
      next();
    })
    .catch(err => {
      next(err);
    });
};

export default uploadImageHandler;
