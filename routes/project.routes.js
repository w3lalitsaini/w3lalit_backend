import express from "express";
import {
  getAllProjects,
  getProjectBySlug,
  createProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const ProjectRouter = express.Router();

ProjectRouter.get("/", getAllProjects);
ProjectRouter.get("/:slug", getProjectBySlug);
ProjectRouter.post("/", adminAuth, createProject);
ProjectRouter.delete("/:id", adminAuth, deleteProject);

export default ProjectRouter;
