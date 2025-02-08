import express from "express";
import {
  handleAddPost,
  handleGetPost,
  handleLike,
  handlecommet,
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
postRouter.put("/like", auth, handleLike);
postRouter.post("/comment", auth, handlecommet);

export default postRouter;
