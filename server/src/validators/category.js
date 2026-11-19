import { body } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Category slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain lowercase letters, numbers, and hyphens only",
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Category description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

export const updateCategoryValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),

  body("slug")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category slug cannot be empty")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must contain lowercase letters, numbers, and hyphens only",
    ),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category description cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body().custom((value) => {
    const { name, slug, description } = value;

    if (name === undefined && slug === undefined && description === undefined) {
      throw new Error("At least one field must be provided");
    }

    return true;
  }),
];
