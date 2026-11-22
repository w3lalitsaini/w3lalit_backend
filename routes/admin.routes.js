import express from "express";
import {
  getAllUsers,
  getAllContacts,
  getAllSubscribers,
  getDashboardStats,
  updateContactStatus,
  deleteContact,
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const AdminRouter = express.Router();

AdminRouter.get("/stats", adminAuth, getDashboardStats);
AdminRouter.get("/users", adminAuth, getAllUsers);
AdminRouter.get("/contacts", adminAuth, getAllContacts);
AdminRouter.patch("/contacts/:id/status", adminAuth, updateContactStatus);
AdminRouter.delete("/contacts/:id", adminAuth, deleteContact);
AdminRouter.get("/subscribers", adminAuth, getAllSubscribers);

export default AdminRouter;
