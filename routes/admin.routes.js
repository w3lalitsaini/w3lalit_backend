import express from "express";
import {
  getAllUsers,
  getAllContacts,
  getAllSubscribers,
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const AdminRouter = express.Router();

AdminRouter.get("/users", adminAuth, getAllUsers);
AdminRouter.get("/contacts", adminAuth, getAllContacts);
AdminRouter.get("/subscribers", adminAuth, getAllSubscribers);

export default AdminRouter;
