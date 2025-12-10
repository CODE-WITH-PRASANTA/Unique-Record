const mongoose = require("mongoose");
const Category = require("../models/category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch {
    res.status(500).json({ message: "Failed to load categories" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    if (!name) return res.status(400).json({ message: "Category name required" });

    const exists = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (exists) return res.status(409).json({ message: "Category already exists" });

    const category = await Category.create({ name });
    res.status(201).json(category);

  } catch {
    res.status(500).json({ message: "Failed to create category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const name = req.body?.name?.trim();
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });
    if (!name)
      return res.status(400).json({ message: "Name required" });

    const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);

  } catch {
    res.status(500).json({ message: "Failed to update" });
  }
};

exports.togglePublishCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Not found" });

    category.published = !category.published;
    await category.save();

    res.json(category);

  } catch {
    res.status(500).json({ message: "Failed to toggle publish" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch {
    res.status(500).json({ message: "Failed to delete category" });
  }
};
