import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Password match
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create Token and set Cookie
    const token = generateToken(existingUser.id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login Success" });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  return res.status(200).json({ message: "Logout success" });
};
