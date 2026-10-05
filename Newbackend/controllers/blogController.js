const mongoose = require('mongoose');
const Blog = require('../models/blogModel');

// @desc    Get published blogs (Public endpoint - only shows Published blogs)
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    // By default, public endpoint only returns Published blogs
    if (status) {
      if (status !== 'All' && status !== 'all') {
        query.status = status;
      }
    } else {
      query.status = 'Published';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { shortDesc: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching blogs',
    });
  }
};

// @desc    Get all blogs for Admin (includes Drafts & Published)
// @route   GET /api/blogs/all
// @access  Admin
const getAllBlogsAdmin = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    if (status && status !== 'All' && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { shortDesc: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin blogs',
    });
  }
};

// @desc    Get single blog by ID or Slug
// @route   GET /api/blogs/:id
// @access  Public / Admin
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id);
    }

    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }

    // Fallback: search by regex formatted title if slug wasn't set on older entries
    if (!blog && typeof id === 'string') {
      const normalizedTitle = id.replace(/-/g, ' ');
      blog = await Blog.findOne({
        title: { $regex: new RegExp(`^${normalizedTitle}$`, 'i') },
      });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Ensure slug is set if missing
    if (!blog.slug && blog.title) {
      blog.slug = blog.title
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-');
    }

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching blog',
    });
  }
};

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Public / Admin
const createBlog = async (req, res) => {
  try {
    const {
      title,
      blogTitle,
      category,
      author,
      authorName,
      authorDesignation,
      email,
      address,
      phoneNumber,
      shortDesc,
      shortDescription,
      quotes,
      content,
      blogContent,
      tags,
      image,
      status,
    } = req.body;

    const finalTitle = (title || blogTitle || '').trim();
    const finalCategory = (category || '').trim();
    const finalContent = content || blogContent || '';

    if (!finalTitle) {
      return res.status(400).json({
        success: false,
        message: 'Blog title is required',
      });
    }

    if (!finalCategory) {
      return res.status(400).json({
        success: false,
        message: 'Blog category is required',
      });
    }

    if (!finalContent || !finalContent.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Blog content is required',
      });
    }

    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        parsedTags = Array.isArray(parsed) ? parsed : [tags];
      } catch {
        parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const slug = finalTitle
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    const newBlog = await Blog.create({
      title: finalTitle,
      slug,
      category: finalCategory,
      author: (author || authorName || 'Admin').trim(),
      authorDesignation: (authorDesignation || '').trim(),
      email: (email || '').trim(),
      address: (address || '').trim(),
      shortDesc: (shortDesc || shortDescription || quotes || '').trim(),
      quotes: (quotes || '').trim(),
      content: finalContent,
      tags: parsedTags,
      image: req.uploadedWebp || image || '',
      status: status || 'Draft',
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating blog',
    });
  }
};

// @desc    Update an existing blog
// @route   PUT /api/blogs/:id
// @access  Public / Admin
const updateBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      author,
      authorDesignation,
      email,
      address,
      shortDesc,
      quotes,
      content,
      tags,
      image,
      status,
    } = req.body;

    const updateData = {};
    if (title !== undefined) {
      updateData.title = title.trim();
      updateData.slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-');
    }
    if (category !== undefined) updateData.category = category.trim();
    if (author !== undefined) updateData.author = author.trim();
    if (authorDesignation !== undefined) updateData.authorDesignation = authorDesignation.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc.trim();
    if (quotes !== undefined) updateData.quotes = quotes.trim();
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating blog',
    });
  }
};

// @desc    Toggle blog status between Published and Draft
// @route   PATCH /api/blogs/:id/status
// @access  Public / Admin
const toggleBlogStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    blog.status = blog.status === 'Published' ? 'Draft' : 'Published';
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog status updated to ${blog.status}`,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling blog status',
    });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Public / Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting blog',
    });
  }
};

module.exports = {
  getBlogs,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  toggleBlogStatus,
  deleteBlog,
};
