import express from "express";
import {protect} from "../middlewares/auth.middleware.js";
import {createCartValidator, updateCartValidator} from "../validators/cart.js";
import {validateRequest} from "../middlewares/validateRequest.js";
import {clearCart, createCart, getCart, removeCart, updateCart} from "../controllers/cart.js";

const router = express.Router()

router.post("/items", protect, createCartValidator, validateRequest, createCart)
router.get("/", protect, getCart)
router.patch("/items/:productId", protect, updateCartValidator, validateRequest, updateCart)
router.delete("/items/:productId", protect, removeCart)
router.delete("/items", protect, clearCart)

export default router