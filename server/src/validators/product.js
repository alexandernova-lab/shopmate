import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Product slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain lowercase letters, numbers, and hyphens only",
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isInt({ min: 0 })
    .withMessage("Price must be a non-negative integer"),

  body("currency")
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter currency code"),

  // Images intentionally optional for now.
  // Handle image uploads later.

  body("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
