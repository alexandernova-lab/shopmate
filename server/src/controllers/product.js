import { Category } from "../models/category.js";
import { Product } from "../models/product.js";
import { deleteImage, uploadMultipleImages } from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, slug, price, currency, stock, category } =
      req.body;

    // Check if category exists
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Upload product images to Cloudinary
    const uploadedImages = await uploadMultipleImages(
      req.files,
      "shopmate/products",
    );

    console.timeEnd("Cloudinary upload");

    console.time("Database creation");

    const product = await Product.create({
      name,
      description,
      slug,
      currency,
      price,
      stock,
      category,
      images: uploadedImages,
    });

    return res
      .status(201)
      .json({ message: "Product created successful", data: product });
  } catch (error) {
    // Clean uploaded images if product creation fails
    if (uploadedImages.length > 0) {
      await Promise.allSettled(
        uploadedImages.map((image) => deleteImage(image.public_id)),
      );
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Product slug already exists",
      });
    }

    console.error("Product category error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "Products retrived success", data: products });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product retrived successfully", data: product });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product id" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const uploadedImages = [];
  const oldPublicIds = [];
  let productSaved = false;
  try {
    const { id } = req.params;
    const {
      name,
      description,
      slug,
      price,
      currency,
      stock,
      category,
      isActive,
    } = req.body;

    if (category) {
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields only when provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (slug !== undefined) product.slug = slug;
    if (price !== undefined) product.price = price;
    if (currency !== undefined) product.currency = currency;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (isActive !== undefined) product.isActive = isActive;

    //  Keep existing Images
    const updatedImages = product.images.map((image) => ({
      image_url: image.image_url,
      public_id: image.public_id,
    }));

    // Check which images the admin wants to replace
    const imageFields = [
      { index: 0, field: "image0" },
      { index: 1, field: "image1" },
      { index: 2, field: "image2" },
    ];

    for (const { index, field } of imageFields) {
      const file = req.files?.[field]?.[0];

      if (!file) continue;

      // Upload the new image
      const [newImage] = await uploadMultipleImages(
        [file],
        "shopmate/products",
      );

      // Track newly uploaded image for failure cleanup
      uploadedImages.push(newImage);

      // Remember old Cloudinary image
      oldPublicIds.push(updatedImages[index].public_id);

      // Replace only the requested position
      updatedImages[index] = newImage;
    }

    //  Save updated images
    if (uploadedImages.length > 0) {
      product.images = updatedImages;
    }

    //  Save product in MongoDB
    await product.save();
    productSaved = true;

    // Delete old cloudinary images after successful DB update
    const cleanupResults = await Promise.allSettled(
      oldPublicIds.map((public_id) => deleteImage(public_id)),
    );
    cleanupResults.forEach((result) => {
      if (result.status === "rejected" || result.value !== true) {
        console.error("Old Cloudinary image cleanup failed:", result);
      }
    });

    return res
      .status(200)
      .json({ message: "Product updated successfully", data: product });
  } catch (error) {
    //  Clean up new uploads if database update failed
    if (!productSaved && uploadedImages.length > 0) {
      await Promise.allSettled(
        uploadedImages.map((image) => deleteImage(image.public_id)),
      );
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Product slug already exists",
      });
    }

    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Collect Cloudinary public IDs
    const publicIds = product.images.map((image) => image.public_id);

    // Delete all images from Cloudinary
    const results = await Promise.allSettled(
      publicIds.map((public_id) => deleteImage(publci_id)),
    );

    // Check whether any image deletion failed
    const failedDeletions = results.some(
      (result) => result.status === "rejected" || result.value !== true,
    );

    if (failedDeletions) {
      console.error("Some Cloudinary images could not be deleted:", {
        productId: id,
        results,
      });

      return res.status(502).json({
        message:
          "Unable to delete all product images. Product was not deleted. Please retry.",
      });
    }

    // Delete product from MongoDB
    await Product.deleteOne();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }

    console.error("Delete Product error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
