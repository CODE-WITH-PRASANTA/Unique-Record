const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  getAllGalleryAdmin,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  toggleGalleryStatus,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { uploadGallery, processGalleryPhoto } = require('../middleware/galleryUploadMiddleware');
const { adminOnly, optionalAuth } = require('../middleware/authMiddleware');

const galleryUploadHandler = (req, res, next) => {
  uploadGallery.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.route('/')
  .get(getGalleryItems)
  .post(adminOnly, galleryUploadHandler, processGalleryPhoto, createGalleryItem);

router.post('/upload', adminOnly, galleryUploadHandler, processGalleryPhoto, createGalleryItem);

router.get('/all', optionalAuth, getAllGalleryAdmin);

router.route('/:id')
  .get(getGalleryById)
  .put(adminOnly, galleryUploadHandler, processGalleryPhoto, updateGalleryItem)
  .delete(adminOnly, deleteGalleryItem);

router.route('/:id/status')
  .patch(adminOnly, toggleGalleryStatus);

module.exports = router;
