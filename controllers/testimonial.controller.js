import mongoose from "mongoose";
import Testimonial from "../models/testimonial.model.js";
import { SEED_TESTIMONIALS } from "../data/seedData.js";
import { readCollection, writeCollection } from "../utils/storage.js";

// Initialize local cache if empty
if (readCollection("testimonials").length === 0) {
  writeCollection("testimonials", SEED_TESTIMONIALS);
}

export const getAllTestimonials = async (req, res) => {
  try {
    let testimonials = [];

    if (mongoose.connection.readyState === 1) {
      testimonials = await Testimonial.find().sort({ createdAt: -1 });
      if (testimonials.length === 0) {
        testimonials = SEED_TESTIMONIALS;
      }
    } else {
      testimonials = readCollection("testimonials");
      if (!testimonials || testimonials.length === 0) {
        testimonials = SEED_TESTIMONIALS;
      }
    }

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving testimonials",
      error: error.message,
    });
  }
};
