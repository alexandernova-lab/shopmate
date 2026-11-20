import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import {
  createProductValidator,
  updateProductValidator,
  validateProductImages,
  validateUpdateProductImages,
} from "../validators/product.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected Admin Routes
router.post(
  "/",
  protect,
  isAdmin,
  upload.array("images", 3),
  validateProductImages,
  createProductValidator,
  validateRequest,
  createProduct,
);

router.patch(
  "/:id",
  protect,
  isAdmin,
  upload.fields([
    { name: "image0", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  validateUpdateProductImages,
  updateProductValidator,
  validateRequest,
  updateProduct,
);

router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
