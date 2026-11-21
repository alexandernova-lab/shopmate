import {body} from "express-validator";

export const createCartValidator = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid Product ID"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({min: 1})
        .withMessage("Quantity must be a positive integer")
        .toInt(),
];

export const updateCartValidator = [
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({min: 1})
        .withMessage("Quantity must be a positive integer")
        .toInt()
]