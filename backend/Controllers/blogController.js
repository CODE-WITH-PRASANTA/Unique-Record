const Blog = require("../Model/Blog");
const cloudinary = require("../Config/cloudinary");

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, content, authorName, category, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs",
    });

    const newBlog = new Blog({
      title,
      description,
      content,
      authorName,
      category,
      tags: tags ? tags.split(",") : [],
      imageUrl: result.secure_url,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully.", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error while creating blog." });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, authorName, category, tags } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // If new image uploaded
    if (req.file) {
      const publicId = blog.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`blogs/${publicId}`);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });

      blog.imageUrl = result.secure_url;
    }

    // Update other fields
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.authorName = authorName || blog.authorName;
    blog.category = category || blog.category;
    blog.tags = tags ? tags.split(",") : blog.tags;

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully.", blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error while updating blog." });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    const publicId = blog.imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`blogs/${publicId}`);

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully." });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error while deleting blog." });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error while fetching blogs." });
  }
};

// Get Single Blog (Optional Bonus)
exports.getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    res.status(500).json({ message: "Server error while fetching blog." });
  }
};
