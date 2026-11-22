import mongoose from "mongoose";
import Project from "../models/project.model.js";
import { SEED_PROJECTS } from "../data/seedData.js";
import { readCollection, writeCollection, insertItem, deleteItem, updateItem } from "../utils/storage.js";

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

export const createProject = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      featured,
      date,
      image,
      link,
      github,
      tags,
      summary,
      overview,
      features,
      challenges,
      solutions,
    } = req.body;

    if (!title || !category || !summary) {
      return res.status(400).json({
        success: false,
        message: "Project title, category, and summary are required fields.",
      });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const projectPayload = {
      id: slug,
      slug,
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "Full-Stack Web Application",
      category: category.toLowerCase().trim(),
      featured: featured === true || featured === "true",
      date: date || new Date().getFullYear().toString(),
      image: image || "assets/images/projects/Movie.jpg",
      link: link || "https://github.com/w3lalitsaini",
      github: github || "https://github.com/w3lalitsaini",
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : ["React", "Node.js"],
      summary: summary.trim(),
      overview: overview ? overview.trim() : summary.trim(),
      features: Array.isArray(features)
        ? features
        : typeof features === "string"
        ? features.split("\n").map((f) => f.trim()).filter(Boolean)
        : ["Modern responsive design", "High-performance architecture"],
      challenges: Array.isArray(challenges)
        ? challenges
        : typeof challenges === "string"
        ? challenges.split("\n").map((c) => c.trim()).filter(Boolean)
        : ["Optimizing network overhead and Core Web Vitals."],
      solutions: Array.isArray(solutions)
        ? solutions
        : typeof solutions === "string"
        ? solutions.split("\n").map((s) => s.trim()).filter(Boolean)
        : ["Engineered modular client state and efficient caching."],
    };

    let createdProject = null;
    if (mongoose.connection.readyState === 1) {
      const newProj = new Project(projectPayload);
      await newProj.save();
      createdProject = newProj;
    } else {
      createdProject = insertItem("projects", projectPayload);
    }

    res.status(201).json({
      success: true,
      message: "Project published successfully!",
      data: createdProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating project",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Project.findByIdAndDelete(id);
      } else {
        await Project.findOneAndDelete({ slug: id });
      }
    }
    deleteItem("projects", id);

    res.status(200).json({
      success: true,
      message: "Project removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting project",
      error: error.message,
    });
  }
};
