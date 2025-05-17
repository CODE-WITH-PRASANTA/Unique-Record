const mongoose = require("mongoose");
const cloudinary = require("../Config/cloudinary");
const fs = require("fs");
const BlogUserModel = require("../Model/BlogUserModel");

// Create a new blog post
const createBlogUserPost = async (req, res) => {
  try {
    const { title, description, content, authorName, category, tags } = req.body;

    const uploadedImage = req.file ? await cloudinary.uploader.upload(req.file.path) : null;

    const newBlogPost = new BlogUserModel({
      title,
      description,
      content,
      authorName,
      category,
      tags: tags ? tags.split(",") : [],
      image: uploadedImage ? uploadedImage.secure_url : "",
    });

    await newBlogPost.save();
    res.status(201).json({ message: "Blog post created successfully", newBlogPost });

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
};

// Fetch all approved blog posts
const getApprovedBlogUserPosts = async (req, res) => {
  try {
    const posts = await BlogUserModel.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch approved blog posts" });
  }
};

// Fetch all unapproved blog posts
const getUnapprovedBlogUserPosts = async (req, res) => {
  try {
    const posts = await BlogUserModel.find({ isApproved: false }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch unapproved blog posts" });
  }
};

// Update a blog post
const updateBlogUserPost = async (req, res) => {
  try {
    const { id } = req.params;

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
      tags: tags ? tags.split(",") : [],
      isApproved,
    };

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path);
      updatedData.image = uploadedImage.secure_url;
    }

    const updatedPost = await BlogUserModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post updated successfully", updatedPost });

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

    if (!updatedPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

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

    const blogPost = await BlogUserModel.findById(id);
    
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    if (blogPost.image) {
      const imagePublicId = blogPost.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imagePublicId);
    }

    await BlogUserModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog post unapproved and deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unapprove and delete blog post" });
  }
};

// Get a single approved blog post by ID
const getSingleApprovedBlogUserPost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid or missing ID" });
    }

    const post = await BlogUserModel.findOne({ _id: id, isApproved: true });

    if (!post) {
      return res.status(404).json({ error: "Approved blog post not found" });
    }

    res.status(200).json(post);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch approved blog post" });
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

module.exports = {
  createBlogUserPost,
  getApprovedBlogUserPosts,
  getUnapprovedBlogUserPosts,
  updateBlogUserPost,
  approveBlogUserPost,
  unapproveBlogUserPost,
  getAllBlogUserPosts,
  getSingleApprovedBlogUserPost
};
