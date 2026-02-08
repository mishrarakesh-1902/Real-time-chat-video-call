import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

/*
  Validate Cloudinary environment variables
*/
const hasCloudinaryConfig =
  ENV.CLOUDINARY_CLOUD_NAME &&
  ENV.CLOUDINARY_API_KEY &&
  ENV.CLOUDINARY_API_SECRET;

if (!hasCloudinaryConfig) {
  console.warn(
    "⚠️ Cloudinary config missing — image uploads will be disabled"
  );
} else {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
  });
}

/*
  Export cloudinary instance
  Controllers should handle upload errors gracefully
*/
export default cloudinary;
