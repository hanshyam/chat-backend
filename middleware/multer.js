// middleware/multer.js
import multer from 'multer';
import path from 'path';

// Directory where images will be temporarily stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/images'); // Ensure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

// Optional: Filter only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  isAllowed ? cb(null, true) : cb(new Error('Only images are allowed'));
};

const upload = multer({ storage, fileFilter });

export default upload;
