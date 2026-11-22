import mongoose from "mongoose";
import Skill from "../models/skill.model.js";
import { SEED_SKILLS } from "../data/seedSkills.js";
import { readCollection, writeCollection, insertItem, deleteItem } from "../utils/storage.js";

// Initialize local skills cache if empty
if (readCollection("skills").length === 0) {
  writeCollection("skills", SEED_SKILLS);
}

export const getAllSkills = async (req, res) => {
  try {
    const { category } = req.query;

    let skills = [];
    if (mongoose.connection.readyState === 1) {
      const query = category && category !== "all" ? { category } : {};
      skills = await Skill.find(query).sort({ createdAt: 1 });
      if (skills.length === 0) {
        skills = category && category !== "all"
          ? SEED_SKILLS.filter((s) => s.category === category)
          : SEED_SKILLS;
      }
    } else {
      skills = readCollection("skills");
      if (!skills || skills.length === 0) {
        skills = SEED_SKILLS;
      }
      if (category && category !== "all") {
        skills = skills.filter((s) => s.category === category);
      }
    }

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving skills",
      error: error.message,
    });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, category, icon, badge, description, usedIn } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Skill name and description are required",
      });
    }

    const skillPayload = {
      name: name.trim(),
      category: category || "frontend",
      icon: icon || "code",
      badge: badge || "TECH",
      description: description.trim(),
      usedIn: Array.isArray(usedIn)
        ? usedIn
        : typeof usedIn === "string"
        ? usedIn.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    let createdSkill = null;
    if (mongoose.connection.readyState === 1) {
      const newSkill = new Skill(skillPayload);
      await newSkill.save();
      createdSkill = newSkill;
    } else {
      createdSkill = insertItem("skills", skillPayload);
    }

    res.status(201).json({
      success: true,
      message: "Skill added successfully!",
      data: createdSkill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating skill",
      error: error.message,
    });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await Skill.findByIdAndDelete(id);
    }
    deleteItem("skills", id);

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting skill",
      error: error.message,
    });
  }
};
