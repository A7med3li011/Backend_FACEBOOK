import express from "express";
import {
  handleAddStroy,
  handlegetStroy,
} from "../controllers/story.controller.js";
import { auth } from "../../middleware/auth.js";
import { multer4server } from "../../services/multer.js";

const storyRoutes = express.Router();
storyRoutes.get("/", auth, handlegetStroy);
storyRoutes.post("/", multer4server().single("story"), auth, handleAddStroy);
export default storyRoutes;
