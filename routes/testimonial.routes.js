import express from "express";
import { getAllTestimonials } from "../controllers/testimonial.controller.js";

const TestimonialRouter = express.Router();

TestimonialRouter.get("/", getAllTestimonials);

export default TestimonialRouter;
