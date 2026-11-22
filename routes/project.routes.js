import express from "express";
import {
  getAllProjects,
  getProjectBySlug,
} from "../controllers/project.controller.js";

const ProjectRouter = express.Router();

ProjectRouter.get("/", getAllProjects);
ProjectRouter.get("/:slug", getProjectBySlug);

export default ProjectRouter;
