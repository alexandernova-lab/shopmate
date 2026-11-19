import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/category.js";

const router = express.Router();

// Public Routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Protected Admin Routes
router.post(
  "/",
  protect,
  isAdmin,
  createCategoryValidator,
  validateRequest,
  createCategory,
);

router.put(
  "/:id",
  protect,
  isAdmin,
  updateCategoryValidator,
  validateRequest,
  updateCategory,
);

router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;
