import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import {
  getAllUsers,
  getAllContacts,
  getAllSubscribers,
  getDashboardStats,
  updateContactStatus,
  deleteContact,
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { sendContactInquiryNotification } from "../services/email.service.js";

const AdminRouter = express.Router();

// Configure Resume Upload Storage
const publicUploads = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(publicUploads)) {
  fs.mkdirSync(publicUploads, { recursive: true });
}

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, publicUploads),
  filename: (req, file, cb) => cb(null, "Lalit_Resume.pdf"),
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Standard Admin Endpoints
AdminRouter.get("/stats", adminAuth, getDashboardStats);
AdminRouter.get("/users", adminAuth, getAllUsers);
AdminRouter.get("/contacts", adminAuth, getAllContacts);
AdminRouter.patch("/contacts/:id/status", adminAuth, updateContactStatus);
AdminRouter.delete("/contacts/:id", adminAuth, deleteContact);
AdminRouter.get("/subscribers", adminAuth, getAllSubscribers);

// Resume Management
AdminRouter.get("/resume-info", adminAuth, (req, res) => {
  try {
    const resumePath = path.join(publicUploads, "Lalit_Resume.pdf");
    const fallbackPath = path.join(process.cwd(), "..", "w3lalitsaini", "assets", "Lalit_Resume.pdf");

    let stats = null;
    let location = "public/uploads/Lalit_Resume.pdf";

    if (fs.existsSync(resumePath)) {
      stats = fs.statSync(resumePath);
    } else if (fs.existsSync(fallbackPath)) {
      stats = fs.statSync(fallbackPath);
      location = "assets/Lalit_Resume.pdf";
    }

    if (!stats) {
      return res.status(200).json({
        success: true,
        exists: false,
        message: "No resume uploaded yet",
      });
    }

    res.status(200).json({
      success: true,
      exists: true,
      filename: "Lalit_Resume.pdf",
      size: (stats.size / 1024).toFixed(1) + " KB",
      updatedAt: stats.mtime.toISOString(),
      url: "/uploads/Lalit_Resume.pdf",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

AdminRouter.post("/resume", adminAuth, uploadResume.single("resume"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select a valid PDF file" });
    }

    // Also synchronize to local frontend assets directory if available
    const frontendAssetsPath = path.join(process.cwd(), "..", "w3lalitsaini", "assets", "Lalit_Resume.pdf");
    try {
      if (fs.existsSync(path.dirname(frontendAssetsPath))) {
        fs.copyFileSync(req.file.path, frontendAssetsPath);
        console.log("✅ Synced updated resume to frontend assets/Lalit_Resume.pdf");
      }
    } catch (copyErr) {
      console.warn("⚠️ Could not sync to frontend assets (non-fatal):", copyErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully! New version is now live.",
      filename: "Lalit_Resume.pdf",
      size: (req.file.size / 1024).toFixed(1) + " KB",
      url: "/uploads/Lalit_Resume.pdf",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Diagnostic Email Delivery Test
AdminRouter.post("/test-email", adminAuth, async (req, res) => {
  try {
    const testData = {
      name: "Admin Diagnostic Verification",
      email: "sainilalit2751@gmail.com",
      phone: "+91 9999999999",
      niche: "Diagnostic Test",
      subject: "W3 Lalit Portfolio — Email System Verification",
      message: "This is a live test email sent from the Admin Control Center to confirm that your SMTP email notification pipeline is active and delivering to sainilalit2751@gmail.com.",
    };

    const result = await sendContactInquiryNotification(testData);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Test email successfully dispatched to sainilalit2751@gmail.com!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Email dispatch failed: " + (result.error || result.reason),
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
});

export default AdminRouter;
