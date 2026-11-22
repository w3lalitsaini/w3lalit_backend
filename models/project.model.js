import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    date: { type: String },
    image: { type: String, required: true },
    link: { type: String, required: true },
    github: { type: String },
    tags: [{ type: String }],
    summary: { type: String, required: true },
    overview: { type: String },
    features: [{ type: String }],
    challenges: [{ type: String }],
    solutions: [{ type: String }],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
