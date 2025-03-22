const express = require("express");
const router = express.Router();
const NoticeController = require("../Controllers/noticeController");
const upload = require("../Middleware/multer");

// Add Notice Route
router.post(
  "/add",
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "otherFiles", maxCount: 1 }]),
  NoticeController.addNotice
);

// Update Notice Route
router.put(
  "/update/:id",
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "otherFiles", maxCount: 1 }]),
  NoticeController.updateNotice
);

// Delete Notice Route
router.delete("/delete/:id", NoticeController.deleteNotice);

// Get All Notices Route
router.get("/all", NoticeController.getAllNotices);

// Get Single Notice by ID
router.get("/:id", NoticeController.getNoticeById);

module.exports = router;
