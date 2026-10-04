const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const baseUruDir = path.join(__dirname, '..', 'upload', 'uru');
createDir(path.join(baseUruDir, 'photos'));
createDir(path.join(baseUruDir, 'videos'));
createDir(path.join(baseUruDir, 'documents'));
createDir(path.join(baseUruDir, 'certificates'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = baseUruDir;
    if (file.fieldname === 'photos') {
      dest = path.join(baseUruDir, 'photos');
    } else if (file.fieldname === 'videos') {
      dest = path.join(baseUruDir, 'videos');
    } else if (file.fieldname === 'documents') {
      dest = path.join(baseUruDir, 'documents');
    } else if (file.fieldname === 'certificate') {
      dest = path.join(baseUruDir, 'certificates');
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${file.fieldname}_${cleanName}_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const uruUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter,
});

module.exports = uruUpload;
