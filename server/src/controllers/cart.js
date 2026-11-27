import { Product } from "../models/product.js";
import { Cart } from "../models/cart.js";

export const createCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Find the product in MongoDB
    const product = await Product.findById(productId);

    //    Check product availability and stock
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: "Product is unavailable" });
    }

    // Find an existing Cart
    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      //   Create new cart for this user
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    // Find existing product in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    // Check stock
    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (item.quantity > product.stock) {
      return res.status(400).json({
        message: "Insufficient quantity",
      });
    }

    await cart.save();

    return res
      .status(201)
      .json({ message: "Product added to cart successfully", data: cart });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }

    console.error("Add to cart error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    //     Find the logged-in user's cart
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    //     Check whether the user has a cart
    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        data: {
          items: [],
        },
      });
    }
    return res.status(200).json({
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        message: "Product is unavailable",
      });
    }

    // Find the cart item
    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    // Check stock
    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    // Update quantity
    cartItem.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }

    console.error("Update cart item error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // Find the product in the cart
    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    return res.status(200).json({
      message: "Cart item removed successfully",
      data: cart,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }

    console.error("Remove cart item error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    // Find the user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // Remove all items from the cart
    cart.items = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
