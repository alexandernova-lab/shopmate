import { Category } from "../models/category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    const category = await Category.create({
      name,
      slug,
      description,
    });

    return res
      .status(201)
      .json({ message: "Category created successfully", data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category slug already exists",
      });
    }

    console.error("Create category error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Categories retrived successfully", data: categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res
      .status(200)
      .json({ message: "Category retrived successfully", data: category });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category id" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category Updated", category });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category slug already exists",
      });
    }

    console.error("Update category error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // const existingProduct = await

    await Category.findByIdAndDelete(id);

    return res.status(200).json({ message: "Category Deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
