import User from "../models/user.model.js";
import Contact from "../models/contact.model.js"; // I should check if contact.model.js exists
import Newsletter from "../models/newsletter.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    // Assuming Contact model existence from previous turns
    // Wait, let me check models first.
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
