const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure upload/notice directory exists
const noticeUploadDir = path.join(__dirname, '..', 'upload', 'notice');
if (!fs.existsSync(noticeUploadDir)) {
  fs.mkdirSync(noticeUploadDir, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();

const uploadNotice = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

// Middleware to process photo into WebP and save extra attached files
const processNoticeFiles = async (req, res, next) => {
  try {
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';

    // 1. Process Photo
    if (req.files && req.files.photo && req.files.photo[0]) {
      const photoFile = req.files.photo[0];
      const photoName = `notice-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const outputPath = path.join(noticeUploadDir, photoName);

      await sharp(photoFile.buffer)
        .webp({ quality: 80 })
        .toFile(outputPath);

      req.body.photo = `${protocol}://${host}/upload/notice/${photoName}`;
    } else if (req.file && req.file.fieldname === 'photo') {
      const photoName = `notice-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const outputPath = path.join(noticeUploadDir, photoName);

      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(outputPath);

      req.body.photo = `${protocol}://${host}/upload/notice/${photoName}`;
    } else if (req.body.photo && typeof req.body.photo === 'string' && req.body.photo.startsWith('data:image/')) {
      const matches = req.body.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const photoName = `notice-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(noticeUploadDir, photoName);

        await sharp(buffer)
          .webp({ quality: 80 })
          .toFile(outputPath);

        req.body.photo = `${protocol}://${host}/upload/notice/${photoName}`;
      }
    }

    // 2. Process Extra Attached Files
    let uploadedFilesList = [];
    if (req.files && req.files.files && req.files.files.length > 0) {
      for (const file of req.files.files) {
        const sanitizedExt = path.extname(file.originalname).toLowerCase();
        const safeName = `file-${Date.now()}-${Math.round(Math.random() * 1e9)}${sanitizedExt}`;
        const savePath = path.join(noticeUploadDir, safeName);

        fs.writeFileSync(savePath, file.buffer);

        uploadedFilesList.push({
          name: file.originalname,
          url: `${protocol}://${host}/upload/notice/${safeName}`,
          size: file.size,
        });
      }
      req.body.files = uploadedFilesList;
    }

    next();
  } catch (error) {
    console.error('Error processing notice uploads:', error);
    next(error);
  }
};

module.exports = {
  uploadNotice,
  processNoticeFiles,
  noticeUploadDir,
};
