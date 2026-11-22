import mongoose from "mongoose";
import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import Newsletter from "../models/newsletter.model.js";
import Project from "../models/project.model.js";
import { readCollection, updateItem, deleteItem } from "../utils/storage.js";

export const getAllUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select("-password");
      return res.status(200).json({ success: true, data: users });
    }
    const localUsers = readCollection("users").map((u) => {
      const { password, ...safe } = u;
      return safe;
    });
    res.status(200).json({ success: true, data: localUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: contacts.length, data: contacts });
    }
    const contacts = readCollection("contacts");
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const subscribers = await Newsletter.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
    }
    const subscribers = readCollection("newsletter");
    res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    let totalContacts = 0;
    let unreadContacts = 0;
    let totalSubscribers = 0;
    let totalProjects = 10;

    if (mongoose.connection.readyState === 1) {
      totalContacts = await Contact.countDocuments();
      unreadContacts = await Contact.countDocuments({ status: "unread" });
      totalSubscribers = await Newsletter.countDocuments();
      totalProjects = await Project.countDocuments();
      if (totalProjects === 0) totalProjects = 10;
    } else {
      const contacts = readCollection("contacts");
      totalContacts = contacts.length;
      unreadContacts = contacts.filter((c) => c.status === "unread").length;
      totalSubscribers = readCollection("newsletter").length;
      const projects = readCollection("projects");
      totalProjects = projects.length || 10;
    }

    res.status(200).json({
      success: true,
      data: {
        totalContacts,
        unreadContacts,
        totalSubscribers,
        totalProjects,
        dbStatus: mongoose.connection.readyState === 1 ? "connected" : "fallback_mode",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["unread", "read", "responded"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
      return res.status(200).json({ success: true, data: updated });
    }

    const updated = updateItem("contacts", id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await Contact.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Contact deleted" });
    }

    const removed = deleteItem("contacts", id);
    res.status(200).json({ success: true, message: "Contact removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
