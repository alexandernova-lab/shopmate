import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Verify JWT
    let decodedValue;

    try {
      decodedValue = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Find Authenticated User
    const user = await User.findById(decodedValue.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exit" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your accunt is inactive " });
    }

    // Attach User to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
