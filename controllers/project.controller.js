import mongoose from "mongoose";
import Project from "../models/project.model.js";
import { SEED_PROJECTS } from "../data/seedData.js";
import { readCollection, writeCollection } from "../utils/storage.js";

// Initialize local projects cache if empty
if (readCollection("projects").length === 0) {
  writeCollection("projects", SEED_PROJECTS);
}

export const getAllProjects = async (req, res) => {
  try {
    const { category, tag, search, featured } = req.query;

    let projects = [];
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (category && category !== "all") query.category = category;
      if (featured === "true") query.featured = true;
      if (tag && tag !== "all") query.tags = tag;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { subtitle: { $regex: search, $options: "i" } },
          { summary: { $regex: search, $options: "i" } },
        ];
      }
      projects = await Project.find(query).sort({ featured: -1, createdAt: -1 });
      if (projects.length === 0) {
        projects = SEED_PROJECTS;
      }
    } else {
      projects = readCollection("projects");
      if (!projects || projects.length === 0) {
        projects = SEED_PROJECTS;
      }
      if (category && category !== "all") {
        projects = projects.filter((p) => p.category === category);
      }
      if (featured === "true") {
        projects = projects.filter((p) => p.featured === true);
      }
      if (tag && tag !== "all") {
        projects = projects.filter((p) =>
          p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
      }
      if (search) {
        const q = search.toLowerCase();
        projects = projects.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.subtitle?.toLowerCase().includes(q) ||
            p.summary.toLowerCase().includes(q)
        );
      }
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving projects",
      error: error.message,
    });
  }
};

export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let project = null;

    if (mongoose.connection.readyState === 1) {
      project = await Project.findOne({ slug });
    }

    if (!project) {
      const localProjects = readCollection("projects");
      project =
        localProjects.find((p) => p.slug === slug || p.id === slug) ||
        SEED_PROJECTS.find((p) => p.slug === slug || p.id === slug);
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
