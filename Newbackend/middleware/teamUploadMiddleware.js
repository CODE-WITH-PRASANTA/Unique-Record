const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure upload/team directory exists
const teamUploadDir = path.join(__dirname, '..', 'upload', 'team');
if (!fs.existsSync(teamUploadDir)) {
  fs.mkdirSync(teamUploadDir, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();

const uploadTeam = multer({
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

// Middleware to convert profilePic to WebP format
const processTeamPhoto = async (req, res, next) => {
  try {
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';

    if (req.file && req.file.buffer) {
      const fileName = `team-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const outputPath = path.join(teamUploadDir, fileName);

      await sharp(req.file.buffer)
        .webp({ quality: 85 })
        .toFile(outputPath);

      req.body.profilePic = `${protocol}://${host}/upload/team/${fileName}`;
    } else if (req.body.profilePic && typeof req.body.profilePic === 'string' && req.body.profilePic.startsWith('data:image/')) {
      const matches = req.body.profilePic.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `team-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(teamUploadDir, fileName);

        await sharp(buffer)
          .webp({ quality: 85 })
          .toFile(outputPath);

        req.body.profilePic = `${protocol}://${host}/upload/team/${fileName}`;
      }
    }

    next();
  } catch (error) {
    console.error('Error processing team photo upload:', error);
    next(error);
  }
};

module.exports = {
  uploadTeam,
  processTeamPhoto,
  teamUploadDir,
};
