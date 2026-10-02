const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure upload/blog directory exists
const uploadDir = path.join(__dirname, '..', 'upload', 'blog');
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

// Middleware to convert uploaded image buffer or Base64 to WebP and save to upload/blog
const convertToWebp = async (req, res, next) => {
  try {
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';

    if (req.file && req.file.buffer) {
      const filename = `blog-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(outputPath);

      const fileUrl = `${protocol}://${host}/upload/blog/${filename}`;
      req.body.image = fileUrl;
      req.uploadedWebp = fileUrl;
    } else if (req.body.image && req.body.image.startsWith('data:image/')) {
      // Decode base64 data URI and convert to WebP
      const matches = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `blog-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(uploadDir, filename);

        await sharp(buffer)
          .webp({ quality: 80 })
          .toFile(outputPath);

        const fileUrl = `${protocol}://${host}/upload/blog/${filename}`;
        req.body.image = fileUrl;
        req.uploadedWebp = fileUrl;
      }
    }
    next();
  } catch (error) {
    console.error('Error converting image to WebP with Sharp:', error);
    next(error);
  }
};

module.exports = {
  upload,
  convertToWebp,
  uploadDir,
};
