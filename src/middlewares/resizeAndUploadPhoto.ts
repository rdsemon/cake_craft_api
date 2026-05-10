import asyncHandler from "../utils/asyncHandler";
import cloudinary from "../utils/cloudinaryConfig";
import streamifier from "streamifier";
import type { UploadApiResponse } from "cloudinary";

import sharp from "sharp";

const resizeAndUploadPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .jpeg({ quality: 90 })
    .toBuffer();

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "user",
        public_id: `user-${req.user.id}`,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Upload failed"));
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

  req.body = req.body || {};

  req.body.image = result.secure_url;
  req.body.publicId = result.public_id;

  next();
});
export default resizeAndUploadPhoto;
