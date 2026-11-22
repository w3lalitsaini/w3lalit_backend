import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { insertItem, readCollection } from "../utils/storage.js";
import { sendAdminSecurityAlert } from "../services/email.service.js";

const getJwtSecret = () => process.env.JWT_SECRET || "w3lalit_secure_dev_jwt_secret_2026";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const assignedRole = role === "admin" || cleanEmail === "sainilalit2751@gmail.com" ? "admin" : "user";
    const hashedPassword = await bcrypt.hash(password, 10);

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists with this email" });
      }

      const user = new User({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: assignedRole,
      });
      await user.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    }

    // Local fallback
    const localUsers = readCollection("users");
    if (localUsers.some((u) => u.email === cleanEmail)) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const newUser = insertItem("users", {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: assignedRole,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully (local storage)",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
    }

    if (!user) {
      const localUsers = readCollection("users");
      user = localUsers.find((u) => u.email === cleanEmail);
    }

    // Auto-create default admin account if logging in with official email
    if (!user && cleanEmail === "sainilalit2751@gmail.com") {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = insertItem("users", {
        name: "Lalit Saini",
        email: cleanEmail,
        password: hashedPassword,
        role: "admin",
      });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || "admin" },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    // Send security login alert to admin (non-blocking)
    sendAdminSecurityAlert(user.email, {
      ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
      userAgent: req.headers["user-agent"],
    }).catch((err) => {
      console.warn("⚠️ Non-fatal: Security alert email error:", err.message);
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "admin",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
