import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMultipleImages = async (files, folder_name) => {
  console.log("Files received:", files?.length);

  const uploadPromises = files.map(async (file, index) => {
    console.log(`Starting image ${index + 1}`);
    console.log("File size:", file.size);

    try {
      const image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const response = await cloudinary.uploader.upload(image, {
        folder: folder_name,
        timeout: 30000,
      });

      console.log(`Image ${index + 1} uploaded successfully`);

      return {
        image_url: response.secure_url,
        public_id: response.public_id,
      };
    } catch (error) {
      console.error(`Image ${index + 1} failed:`, error.message);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
};

export const deleteImage = async (public_id) => {
  const response = await cloudinary.uploader.destroy(public_id);

  return response?.result === "ok";
};

export default cloudinary;
