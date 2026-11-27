import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    //     Find User Cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your Cart is empty",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    //     Check products and calculate total
    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: "Product is available",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      //     Save Product information
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      //     Calculate total
      totalAmount += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    //     Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
    });

    //  Clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
