const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload/event-registrations directory exists
const eventRegUploadDir = path.join(__dirname, '..', 'upload', 'event-registrations');
if (!fs.existsSync(eventRegUploadDir)) {
  fs.mkdirSync(eventRegUploadDir, { recursive: true });
}

// Disk storage for bioData and photo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, eventRegUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `event-reg-${file.fieldname}-${cleanBase}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Photo must be an image file (JPG, PNG, WEBP)'), false);
      }
    } else if (file.fieldname === 'bioData') {
      const allowedExts = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedExts.includes(ext) || file.mimetype.includes('pdf') || file.mimetype.includes('word') || file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Bio-data must be a PDF, Word document, or image file'), false);
      }
    } else {
      cb(null, true);
    }
  },
}).fields([
  { name: 'bioData', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
]);

// Wrapper to handle Multer errors with clean 400 responses
const uploadEventRegFiles = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum allowed size is 25MB per file.',
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }
    next();
  });
};

module.exports = {
  uploadEventRegFiles,
  eventRegUploadDir,
};

