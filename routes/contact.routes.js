import express from "express";
import { contactSubmit } from "../controllers/contact.controller.js";

const ContactRouter = express.Router();

ContactRouter.post("/submit", contactSubmit);

export default ContactRouter;
