import bcrypt from "bcrypt";
import { User } from "../models/user.js";

export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Check for existing email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or Username already exists" });
    }

    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Prepare response without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    return res
      .status(201)
      .json({ message: "User registered successfully", data: userResponse });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
