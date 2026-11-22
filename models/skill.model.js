import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["frontend", "backend", "database", "tools", "architecture"],
      default: "frontend",
    },
    icon: { type: String, default: "code" },
    badge: { type: String, default: "CORE" },
    description: { type: String, required: true },
    usedIn: [{ type: String }],
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
