const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure upload/event directory exists
const uploadDir = path.join(__dirname, '..', 'upload', 'event');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();

// File filter (accept images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter,
});

// Middleware to convert uploaded image buffer or Base64 to WebP and save to upload/event
const convertEventImageToWebp = async (req, res, next) => {
  try {
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';

    if (req.file && req.file.buffer) {
      const filename = `event-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(outputPath);

      const fileUrl = `${protocol}://${host}/upload/event/${filename}`;
      req.body.locationImage = fileUrl;
      req.body.eventImage = fileUrl;
      req.uploadedWebp = fileUrl;
    } else {
      const incomingImage = req.body.locationImage || req.body.eventImage;
      if (incomingImage && incomingImage.startsWith('data:image/')) {
        const matches = incomingImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const buffer = Buffer.from(matches[2], 'base64');
          const filename = `event-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
          const outputPath = path.join(uploadDir, filename);

          await sharp(buffer)
            .webp({ quality: 80 })
            .toFile(outputPath);

          const fileUrl = `${protocol}://${host}/upload/event/${filename}`;
          req.body.locationImage = fileUrl;
          req.body.eventImage = fileUrl;
          req.uploadedWebp = fileUrl;
        }
      }
    }
    next();
  } catch (error) {
    console.error('Error converting event image to WebP:', error);
    next(error);
  }
};

module.exports = {
  upload,
  convertEventImageToWebp,
  uploadDir,
};
