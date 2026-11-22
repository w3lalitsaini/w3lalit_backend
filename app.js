import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import AuthRouter from "./routes/auth.routes.js";
import ContactRouter from "./routes/contact.routes.js";
import AdminRouter from "./routes/admin.routes.js";
import NewsletterRouter from "./routes/newsletter.routes.js";
import ProjectRouter from "./routes/project.routes.js";
import TestimonialRouter from "./routes/testimonial.routes.js";
import SkillRouter from "./routes/skill.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: true, // Allow requests from any origin (e.g. localhost:8080, localhost:5500, production)
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Health and Root Status Endpoints
const getHealthStatus = () => ({
  status: "online",
  service: "W3 Lalit Developer Portfolio API",
  author: "Lalit Saini",
  version: "1.0.0",
  timestamp: new Date().toISOString(),
  uptime: Math.floor(process.uptime()) + "s",
  database: {
    state: mongoose.connection.readyState === 1 ? "connected" : "fallback_storage",
    readyState: mongoose.connection.readyState,
  },
  endpoints: {
    health: "/api/health",
    contactSubmit: "POST /contact/submit",
    newsletterSubscribe: "POST /newsletter/subscribe",
    projects: "GET /api/projects",
    projectDetail: "GET /api/projects/:slug",
    testimonials: "GET /api/testimonials",
    authLogin: "POST /auth/login",
    authRegister: "POST /auth/register",
    adminStats: "GET /admin/stats",
    adminContacts: "GET /admin/contacts",
    adminSubscribers: "GET /admin/subscribers",
  },
});

app.get("/", (req, res) => {
  res.status(200).json(getHealthStatus());
});

app.get("/api/health", (req, res) => {
  res.status(200).json(getHealthStatus());
});

// Mounted Routes
app.use("/auth", AuthRouter);
app.use("/contact", ContactRouter);
app.use("/admin", AdminRouter);
app.use("/newsletter", NewsletterRouter);
app.use("/projects", ProjectRouter);
app.use("/api/projects", ProjectRouter);
app.use("/testimonials", TestimonialRouter);
app.use("/api/testimonials", TestimonialRouter);
app.use("/skills", SkillRouter);
app.use("/api/skills", SkillRouter);

// 404 Handler for API
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

// Start Server and Connect Database
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/w3lalit";

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 W3 Lalit Portfolio Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

// Asynchronous Non-blocking MongoDB Connection with Graceful Fallback
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    })
    .then(() => {
      console.log("✅ Connected to MongoDB Atlas successfully");
    })
    .catch((err) => {
      console.warn("⚠️  MongoDB connection unavailable:", err.message);
      console.log("💡 Running with local resilient JSON storage (/data/) fallback.");
      console.log("   All inquiries, subscriptions, and portfolio data will function seamlessly.");
    });
} else {
  console.log("💡 No MONGO_URI provided. Running in local storage fallback mode.");
}

export default app;
