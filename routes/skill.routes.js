import express from "express";
import {
  getAllSkills,
  createSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const SkillRouter = express.Router();

SkillRouter.get("/", getAllSkills);
SkillRouter.post("/", adminAuth, createSkill);
SkillRouter.delete("/:id", adminAuth, deleteSkill);

export default SkillRouter;
