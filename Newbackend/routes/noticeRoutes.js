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

const noticeUploadFields = uploadNotice.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'files', maxCount: 5 },
]);

router.route('/')
  .get(getNotices)
  .post(noticeUploadFields, processNoticeFiles, createNotice);

router.get('/all', getAllNoticesAdmin);

router.route('/:id')
  .get(getNoticeById)
  .put(noticeUploadFields, processNoticeFiles, updateNotice)
  .delete(deleteNotice);

router.route('/:id/status')
  .patch(toggleNoticeStatus);

module.exports = router;
