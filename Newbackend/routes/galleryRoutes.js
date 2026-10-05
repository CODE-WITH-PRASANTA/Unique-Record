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
  .post(galleryUploadHandler, processGalleryPhoto, createGalleryItem);

router.post('/upload', galleryUploadHandler, processGalleryPhoto, createGalleryItem);

router.get('/all', getAllGalleryAdmin);

router.route('/:id')
  .get(getGalleryById)
  .put(galleryUploadHandler, processGalleryPhoto, updateGalleryItem)
  .delete(deleteGalleryItem);

router.route('/:id/status')
  .patch(toggleGalleryStatus);

module.exports = router;
