import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AuthRouter from "./routes/auth.routes.js";
import ContactRouter from "./routes/contact.routes.js";
import AdminRouter from "./routes/admin.routes.js";
import NewsletterRouter from "./routes/newsletter.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/auth", AuthRouter);
app.use("/contact", ContactRouter);
app.use("/admin", AdminRouter);
app.use("/newsletter", NewsletterRouter);

// DB Connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/w3lalit";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
