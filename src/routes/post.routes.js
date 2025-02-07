import express from "express";
import {
  handleAddPost,
  handleGetPost,
} from "../controllers/post.controller.js";
import { multer4server } from "../../services/multer.js";
import { auth } from "../../middleware/auth.js";

const postRouter = express.Router();

postRouter.post(
  "/addPost",
  multer4server().single("midea"),
  auth,
  handleAddPost
);
postRouter.get(
  "/getposts",

  auth,
  handleGetPost
);

export default postRouter;
