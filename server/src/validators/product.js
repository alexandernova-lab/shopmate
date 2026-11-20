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

// Product image validation
export const validateProductImages = (req, res, next) => {
  if (!req.files || req.files.length !== 3) {
    return res.status(400).json({
      message: "Exactly 3 product images are required",
    });
  }
  next();
};

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product description cannot be empty"),

  body("slug")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product slug cannot be empty")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain lowercase letters, numbers, and hyphens only",
    ),

  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Price must be a non-negative integer")
    .toInt(),

  body("currency")
    .optional()
    .trim()
    .toUpperCase()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be exactly 3 characters")
    .isAlpha()
    .withMessage("Currency must contain letters only"),

  body("category").optional().isMongoId().withMessage("Invalid category ID"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer")
    .toInt(),

  // Reject an empty update request
  body().custom((value, { req }) => {
    const hasBodyFields = Object.keys(req.body).length > 0;
    const hasImages = Object.keys(req.files || {}).length > 0;

    if (!hasBodyFields && !hasImages) {
      throw new Error("At least one field is required to update");
    }

    return true;
  }),
];

export const validateUpdateProductImages = (req, res, next) => {
  const allowedFields = ["image0", "image1", "image2"];

  const uploadedFields = Object.keys(req.files || {});

  const invalidFields = uploadedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: "Invalid image field",
    });
  }

  next();
};
