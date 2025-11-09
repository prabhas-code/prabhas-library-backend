import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    console.log("local file path in cloudinary", localFilePath);
    const normalisedPath = path.resolve(localFilePath); // absolute path
    console.log("normalised path", normalisedPath);

    const response = await cloudinary.uploader.upload(normalisedPath, {
      resource_type: "auto",
    });

    console.log("file uploaded successfully", response.url);

    // delete local file after successful upload
    // try {
    //   fs.unlinkSync(normalisedPath);
    // } catch (err) {
    //   console.warn("Failed to delete local file:", err);
    // }

    return response;
  } catch (error) {
    console.log("upload failed", error);

    // try deleting the local file even if upload failed
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.warn("Failed to delete local file after failed upload:", err);
    }

    return null;
  }
};
export { uploadOnCloudinary };
