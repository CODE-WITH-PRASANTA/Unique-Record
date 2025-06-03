const Blog = require("../Model/Blog");
const cloudinary = require("../Config/cloudinary");
const fs = require("fs");

// Create Blog
const createBlog = async (req, res) => {
  try {
    const {
      blogTitle,
      shortDescription,
      quotes,
      blogContent,
      category,
      authorName,
      authorDesignation,
      phoneNumber,
      email,
      address,
      tags,
    } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs",
    });

    const newBlog = new Blog({
      blogTitle,
      shortDescription,
      quotes,
      blogContent,
      category,
      authorName,
      authorDesignation: authorDesignation ?? "",
      phoneNumber: phoneNumber ?? "",
      email: email ?? "",
      address: address ?? "",
      tags: JSON.parse(tags),
      imageUrl: result.secure_url,
    });

    await newBlog.save();
    fs.unlinkSync(req.file.path); // Clean temp file

    res.status(201).json({ success: true, message: "Blog created", data: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Fetch All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

// Fetch Blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch blog" });
  }
};

// Update Blog
const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    let updateData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });
      updateData.imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    if (updateData.tags) {
      updateData.tags = JSON.parse(updateData.tags);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog updated", data: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update blog" });
  }
};

// Delete Blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Extract public_id from Cloudinary URL
    const imageUrl = blog.imageUrl;
    const publicIdMatch = imageUrl.match(/\/blogs\/([^/.]+)\./);
    if (publicIdMatch && publicIdMatch[1]) {
      const publicId = `blogs/${publicIdMatch[1]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete blog from MongoDB
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Blog and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Failed to delete blog" });
  }
};


module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
