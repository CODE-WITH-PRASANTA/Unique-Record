const express = require('express');
const { getVideos, addVideo, deleteVideo } = require('../Controllers/youtubeController');

const router = express.Router();

router.get('/', getVideos);
router.post('/', addVideo);
router.delete('/:id', deleteVideo);

module.exports = router;
