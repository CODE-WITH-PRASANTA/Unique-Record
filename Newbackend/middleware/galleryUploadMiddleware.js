const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure upload/gallery directory exists
const galleryUploadDir = path.join(__dirname, '..', 'upload', 'gallery');
if (!fs.existsSync(galleryUploadDir)) {
  fs.mkdirSync(galleryUploadDir, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();

const uploadGallery = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Middleware to convert uploaded image to WebP format
const processGalleryPhoto = async (req, res, next) => {
  try {
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';

    if (req.file && req.file.buffer) {
      const fileName = `gallery-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const outputPath = path.join(galleryUploadDir, fileName);

      await sharp(req.file.buffer)
        .webp({ quality: 85 })
        .toFile(outputPath);

      const generatedUrl = `${protocol}://${host}/upload/gallery/${fileName}`;
      req.body.imageUrl = generatedUrl;
      req.body.photoUrl = generatedUrl;
    } else if (req.body.photoUrl && typeof req.body.photoUrl === 'string' && req.body.photoUrl.startsWith('data:image/')) {
      const matches = req.body.photoUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `gallery-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(galleryUploadDir, fileName);

        await sharp(buffer)
          .webp({ quality: 85 })
          .toFile(outputPath);

        const generatedUrl = `${protocol}://${host}/upload/gallery/${fileName}`;
        req.body.imageUrl = generatedUrl;
        req.body.photoUrl = generatedUrl;
      }
    } else if (req.body.imageUrl && typeof req.body.imageUrl === 'string' && req.body.imageUrl.startsWith('data:image/')) {
      const matches = req.body.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `gallery-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(galleryUploadDir, fileName);

        await sharp(buffer)
          .webp({ quality: 85 })
          .toFile(outputPath);

        const generatedUrl = `${protocol}://${host}/upload/gallery/${fileName}`;
        req.body.imageUrl = generatedUrl;
        req.body.photoUrl = generatedUrl;
      }
    } else if (req.body.photoUrl && !req.body.imageUrl) {
      req.body.imageUrl = req.body.photoUrl;
    } else if (req.body.imageUrl && !req.body.photoUrl) {
      req.body.photoUrl = req.body.imageUrl;
    }

    next();
  } catch (error) {
    console.error('Error processing gallery photo upload:', error);
    next(error);
  }
};

module.exports = {
  uploadGallery,
  processGalleryPhoto,
  galleryUploadDir,
};
