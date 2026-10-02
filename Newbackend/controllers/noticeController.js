const Notice = require('../models/noticeModel');

// @desc    Get active notices (Public endpoint)
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { active: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { postOwner: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const notices = await Notice.find(query).sort({ postingDate: -1, createdAt: -1 });

    res.status(200).json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notices',
    });
  }
};

// @desc    Get all notices for Admin (Active & Inactive)
// @route   GET /api/notices/all
// @access  Admin / Public
const getAllNoticesAdmin = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { postOwner: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const notices = await Notice.find(query).sort({ postingDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    console.error('Error fetching all notices:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching all notices',
    });
  }
};

// @desc    Get single notice by ID
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notice',
    });
  }
};

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Admin
const createNotice = async (req, res) => {
  try {
    const {
      title,
      postingDate,
      postOwner,
      description,
      link,
      photo,
      files,
      active,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Notice title is required' });
    }
    if (!postingDate || !postingDate.trim()) {
      return res.status(400).json({ success: false, message: 'Posting date is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Notice description is required' });
    }

    let parsedFiles = [];
    if (Array.isArray(req.body.files)) {
      parsedFiles = req.body.files;
    } else if (typeof files === 'string' && files.trim()) {
      try {
        parsedFiles = JSON.parse(files);
      } catch {
        parsedFiles = [];
      }
    }

    const finalPhoto = req.body.photo || photo || '';
    const otherFiles = parsedFiles.length > 0 ? parsedFiles[0].url : '';

    const newNotice = await Notice.create({
      title: title.trim(),
      postingDate: postingDate.trim(),
      postOwner: (postOwner || 'Admin').trim(),
      description: description.trim(),
      link: (link || '').trim(),
      photo: finalPhoto,
      files: parsedFiles,
      otherFiles,
      active: active !== undefined ? (active === 'true' || active === true) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: newNotice,
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating notice',
    });
  }
};

// @desc    Update an existing notice
// @route   PUT /api/notices/:id
// @access  Admin
const updateNotice = async (req, res) => {
  try {
    const {
      title,
      postingDate,
      postOwner,
      description,
      link,
      photo,
      files,
      active,
    } = req.body;

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    if (title !== undefined) notice.title = title.trim();
    if (postingDate !== undefined) notice.postingDate = postingDate.trim();
    if (postOwner !== undefined) notice.postOwner = postOwner.trim();
    if (description !== undefined) notice.description = description.trim();
    if (link !== undefined) notice.link = link.trim();
    if (req.body.photo) notice.photo = req.body.photo;
    else if (photo !== undefined) notice.photo = photo;

    if (req.body.files && Array.isArray(req.body.files)) {
      notice.files = req.body.files;
      notice.otherFiles = req.body.files.length > 0 ? req.body.files[0].url : '';
    } else if (typeof files === 'string' && files.trim()) {
      try {
        const parsed = JSON.parse(files);
        notice.files = parsed;
        notice.otherFiles = parsed.length > 0 ? parsed[0].url : '';
      } catch {
        // keep existing files
      }
    }

    if (active !== undefined) {
      notice.active = active === 'true' || active === true;
    }

    const updatedNotice = await notice.save();

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: updatedNotice,
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating notice',
    });
  }
};

// @desc    Toggle notice status (Active / Inactive)
// @route   PATCH /api/notices/:id/status
// @access  Admin
const toggleNoticeStatus = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    notice.active = !notice.active;
    await notice.save();

    res.status(200).json({
      success: true,
      message: `Notice status updated to ${notice.active ? 'Active' : 'Inactive'}`,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling notice status',
    });
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Admin
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully',
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting notice',
    });
  }
};

module.exports = {
  getNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  toggleNoticeStatus,
  deleteNotice,
};
