import mongoose from "mongoose";
import Newsletter from "../models/newsletter.model.js";
import { insertItem, readCollection } from "../utils/storage.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (mongoose.connection.readyState === 1) {
      const existingSubscriber = await Newsletter.findOne({ email: cleanEmail });
      if (existingSubscriber) {
        return res.status(200).json({
          success: true,
          message: "You are already subscribed to the newsletter!",
        });
      }

      const newSubscriber = new Newsletter({ email: cleanEmail });
      await newSubscriber.save();
    } else {
      const localSubscribers = readCollection("newsletter");
      const exists = localSubscribers.some((s) => s.email === cleanEmail);
      if (exists) {
        return res.status(200).json({
          success: true,
          message: "You are already subscribed to the newsletter!",
        });
      }
      insertItem("newsletter", { email: cleanEmail, status: "active" });
    }

    res.status(201).json({
      success: true,
      message: "Thank you for subscribing to technical updates!",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({
      success: false,
      message: "Server error processing subscription",
      error: error.message,
    });
  }
};
