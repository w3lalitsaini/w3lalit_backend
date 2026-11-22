import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { insertItem, readCollection, writeCollection } from "../utils/storage.js";

dotenv.config();

const ADMIN_EMAIL = (process.argv[2] || "sainilalit2751@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.argv[3] || "LalitAdmin@2026";
const ADMIN_NAME = "Lalit Saini";

async function createAdmin() {
  console.log("====================================================");
  console.log("Creating / Resetting Admin User:");
  console.log("Email:", ADMIN_EMAIL);
  console.log("Password:", ADMIN_PASSWORD);
  console.log("Role: admin");
  console.log("====================================================");

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // 1. Update / Create in Local Fallback Storage
  const users = readCollection("users");
  const existingLocalIdx = users.findIndex((u) => u.email === ADMIN_EMAIL);

  if (existingLocalIdx !== -1) {
    users[existingLocalIdx].password = hashedPassword;
    users[existingLocalIdx].role = "admin";
    users[existingLocalIdx].name = ADMIN_NAME;
    users[existingLocalIdx].updatedAt = new Date().toISOString();
    writeCollection("users", users);
    console.log("✅ Updated admin account in local JSON storage (/data/users.json)");
  } else {
    insertItem("users", {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Created admin account in local JSON storage (/data/users.json)");
  }

  // 2. Update / Create in MongoDB (if MONGO_URI is configured and accessible)
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri && !mongoUri.includes("<db_password>")) {
    try {
      console.log("Connecting to MongoDB Atlas...");
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log("Connected to MongoDB Atlas!");

      let mongoUser = await User.findOne({ email: ADMIN_EMAIL });
      if (mongoUser) {
        mongoUser.password = hashedPassword;
        mongoUser.role = "admin";
        mongoUser.name = ADMIN_NAME;
        await mongoUser.save();
        console.log("✅ Updated admin account in MongoDB Atlas database");
      } else {
        mongoUser = new User({
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: "admin",
        });
        await mongoUser.save();
        console.log("✅ Created admin account in MongoDB Atlas database");
      }
      await mongoose.disconnect();
    } catch (err) {
      console.warn("⚠️ Could not connect to MongoDB Atlas (check password/network):", err.message);
      console.log("💡 Admin account is fully active in local storage fallback!");
    }
  } else {
    console.log("💡 MONGO_URI has placeholder password or not set. Local storage admin is ready!");
  }

  console.log("\n🎉 Admin setup complete!");
  console.log("You can now sign in at: http://localhost:8080/admin.html or https://w3lalit.vercel.app/admin.html");
  process.exit(0);
}

createAdmin().catch(console.error);
