const YoutubeVideo = require('../Model/YoutubeVideo');

// Get all videos
const getVideos = async (req, res) => {
  try {
    const videos = await YoutubeVideo.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error });
  }
};

// Add a video
const addVideo = async (req, res) => {
  const { link } = req.body;

  const embedMatch = link.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/) ||
                     link.match(/(?:https?:\/\/)?youtu\.be\/([^?&]+)/);

  if (!embedMatch) {
    return res.status(400).json({ message: 'Invalid YouTube link' });
  }

  const embedLink = `https://www.youtube.com/embed/${embedMatch[1]}`;

  try {
    const newVideo = new YoutubeVideo({ link, embedLink });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video', error });
  }
};

// Delete a video
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await YoutubeVideo.findByIdAndDelete(id);
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error });
  }
};

// 👇 Export functions using CommonJS
module.exports = {
  getVideos,
  addVideo,
  deleteVideo,
};
