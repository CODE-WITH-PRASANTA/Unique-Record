const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure upload/achievements directory exists
const achievementUploadDir = path.join(__dirname, '..', 'upload', 'achievements');
if (!fs.existsSync(achievementUploadDir)) {
  fs.mkdirSync(achievementUploadDir, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();

const uploadAchievement = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Middleware to convert uploaded image or Base64 to WebP
const processAchievementImage = async (req, res, next) => {
  try {
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';

    if (req.file && req.file.buffer) {
      const fileName = `achievement-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const outputPath = path.join(achievementUploadDir, fileName);

      await sharp(req.file.buffer)
        .webp({ quality: 85 })
        .toFile(outputPath);

      const generatedUrl = `${protocol}://${host}/upload/achievements/${fileName}`;
      req.body.image = generatedUrl;
      req.body.imageUrl = generatedUrl;
      req.uploadedWebp = generatedUrl;
    } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('data:image/')) {
      const matches = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `achievement-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(achievementUploadDir, fileName);

        await sharp(buffer)
          .webp({ quality: 85 })
          .toFile(outputPath);

        const generatedUrl = `${protocol}://${host}/upload/achievements/${fileName}`;
        req.body.image = generatedUrl;
        req.body.imageUrl = generatedUrl;
        req.uploadedWebp = generatedUrl;
      }
    } else if (req.body.imageUrl && typeof req.body.imageUrl === 'string' && req.body.imageUrl.startsWith('data:image/')) {
      const matches = req.body.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `achievement-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(achievementUploadDir, fileName);

        await sharp(buffer)
          .webp({ quality: 85 })
          .toFile(outputPath);

        const generatedUrl = `${protocol}://${host}/upload/achievements/${fileName}`;
        req.body.image = generatedUrl;
        req.body.imageUrl = generatedUrl;
        req.uploadedWebp = generatedUrl;
      }
    }
    next();
  } catch (error) {
    console.error('Error processing achievement image:', error);
    next(error);
  }
};

module.exports = {
  uploadAchievement,
  processAchievementImage,
  achievementUploadDir,
};
