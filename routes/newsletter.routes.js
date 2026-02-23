import express from "express";
import { subscribe } from "../controllers/newsletter.controller.js";

const NewsletterRouter = express.Router();

NewsletterRouter.post("/subscribe", subscribe);

export default NewsletterRouter;
