import mongoose from "mongoose";
import Contact from "../models/contact.model.js";
import { insertItem, readCollection, updateItem, deleteItem } from "../utils/storage.js";

export const contactSubmit = async (req, res) => {
  try {
    const { name, email, phone, niche, projectType, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const resolvedNiche = niche || projectType || "General Inquiry";
    const resolvedSubject = subject || resolvedNiche || "Portfolio Contact Inquiry";

    const contactPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      niche: resolvedNiche,
      subject: resolvedSubject,
      message: message.trim(),
      status: "unread",
    };

    if (mongoose.connection.readyState === 1) {
      const newContact = new Contact(contactPayload);
      await newContact.save();
    } else {
      insertItem("contacts", contactPayload);
    }

    console.log("Contact submission received:", {
      name: contactPayload.name,
      email: contactPayload.email,
      niche: contactPayload.niche,
    });

    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been received. I will reply within 24 hours.",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({
      success: false,
      message: "Server error processing message",
      error: error.message,
    });
  }
};
