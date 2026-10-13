const express = require('express');
const router = express.Router();
const {
  getNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  toggleNoticeStatus,
  deleteNotice,
} = require('../controllers/noticeController');
const { uploadNotice, processNoticeFiles } = require('../middleware/noticeUploadMiddleware');
const { adminOnly } = require('../middleware/authMiddleware');

const noticeUploadFields = uploadNotice.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'files', maxCount: 5 },
]);

router.route('/')
  .get(getNotices)
  .post(adminOnly, noticeUploadFields, processNoticeFiles, createNotice);

router.get('/all', adminOnly, getAllNoticesAdmin);

router.route('/:id')
  .get(getNoticeById)
  .put(adminOnly, noticeUploadFields, processNoticeFiles, updateNotice)
  .delete(adminOnly, deleteNotice);

router.route('/:id/status')
  .patch(adminOnly, toggleNoticeStatus);

module.exports = router;
