const mongoose = require("mongoose"); // Add this import statement
const cloudinary = require("../Config/cloudinary");
const fs = require("fs");
const path = require("path");
const BlogUserModel = require("../Model/BlogUserModel");

// Create a new blog post
const createBlogUserPost = async (req, res) => {
  try {
    const { title, description, content, authorName, category, tags } = req.body;

    // Handle image upload to Cloudinary
    const uploadedImage = req.file ? await cloudinary.uploader.upload(req.file.path) : null;

    const newBlogPost = new BlogUserModel({
      title,
      description,
      content,
      authorName,
      category,
      tags: tags.split(","),
      image: uploadedImage ? uploadedImage.secure_url : "",
    });

    await newBlogPost.save();
    res.status(201).json({ message: "Blog post created successfully", newBlogPost });

    // Cleanup the temporary uploaded image
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
};

// Get all blog posts
const getAllBlogUserPosts = async (req, res) => {
  try {
    const posts = await BlogUserModel.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
};

// Update a blog post
const updateBlogUserPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid or missing ID" });
    }

    const { title, description, content, authorName, category, tags, isApproved } = req.body;

    const updatedData = {
      title,
      description,
      content,
      authorName,
      category,
      tags: tags.split(","),
      isApproved,
    };

    if (req.file) {
      // Handle image update to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(req.file.path);
      updatedData.image = uploadedImage.secure_url;
    }

    const updatedPost = await BlogUserModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post updated successfully", updatedPost });

    // Cleanup the temporary uploaded image
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update blog post" });
  }
};

// Approve a blog post
const approveBlogUserPost = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPost = await BlogUserModel.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    res.status(200).json({ message: "Blog post approved", updatedPost });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve blog post" });
  }
};

// Unapprove (delete) a blog post
const unapproveBlogUserPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog post by ID to get the image URL for Cloudinary deletion
    const blogPost = await BlogUserModel.findById(id);
    
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Delete the image from Cloudinary if it exists
    if (blogPost.image) {
      const imagePublicId = blogPost.image.split('/').pop().split('.')[0]; // Extract the public ID from the image URL
      await cloudinary.uploader.destroy(imagePublicId);
    }

    // Delete the blog post from the database
    await BlogUserModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog post unapproved and deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unapprove and delete blog post" });
  }
};

module.exports = {
  createBlogUserPost,
  getAllBlogUserPosts,
  updateBlogUserPost,
  approveBlogUserPost,
  unapproveBlogUserPost,
};
