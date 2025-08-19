const Achievement = require('../Model/achivementModel');
const cloudinary = require('../Config/cloudinary');

exports.postAchievement = async (req, res) => {
  try {
    const { title, shortDescription, content, providerName, achieverName, category, tags } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    if (!title || !shortDescription || !content || !providerName || !achieverName || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await cloudinary.uploader.upload(image.path);

    const achievement = new Achievement({
      title,
      shortDescription,
      content,
      providerName,
      achieverName,
      category,
      tags,
      image: result.secure_url,
      publicId: result.public_id,
    });

    await achievement.save();

    res.status(201).json({ message: 'Achievement posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error posting achievement' });
  }
};

// Update Achievement Photo
exports.updateAchievementPhoto = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    if (achievement.publicId) {
      await cloudinary.uploader.destroy(achievement.publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    if (!result) {
      return res.status(500).json({ message: 'Error uploading image' });
    }

    achievement.image = result.secure_url;
    achievement.publicId = result.public_id;

    await achievement.save();

    res.status(200).json(achievement);
  } catch (error) {
    console.error(error); // Log the actual error
    res.status(500).json({ message: 'Error updating achievement photo' });
  }
};

// Delete Achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    if (achievement.publicId) {
      try {
        await cloudinary.uploader.destroy(achievement.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await Achievement.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ message: 'Error deleting achievement' });
  }
};

// Get All Achievements
exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

// Get Achievement by ID
exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(200).json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievement' });
  }
};
