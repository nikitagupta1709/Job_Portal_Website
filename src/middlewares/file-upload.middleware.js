import multer from "multer"; // Import the multer middleware for handling file uploads

// Configure storage settings for multer
const storageConfig = multer.diskStorage({
  // Set the destination where uploaded files will be stored
  destination: (req, file, cb) => {
    cb(null, "public/resumes/"); // Specify the directory for storing resumes
  },
  // Set the filename for uploaded files
  filename: (req, file, cb) => {
    // Create a unique filename using the current timestamp and the original file name
    const name = Date.now() + "-" + file.originalname;
    cb(null, name); // Return the new filename
  },
});

// Create the multer upload middleware using the storage configuration
export const uploadFile = multer({ storage: storageConfig });
