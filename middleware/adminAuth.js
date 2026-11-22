import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { readCollection } from "../utils/storage.js";

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, secret);

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id);
    } else {
      const localUsers = readCollection("users");
      user = localUsers.find((u) => u._id === decoded.id || u.email === decoded.email);
    }

    // Allow if user is admin role or matched owner email
    const isOwner = decoded.email === "Sainilalit2751@gmail.com";
    if (!user && !isOwner) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const role = user?.role || (isOwner ? "admin" : "user");
    if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }

    req.user = user || { id: decoded.id, email: decoded.email, role: "admin" };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token is invalid or expired" });
  }
};
