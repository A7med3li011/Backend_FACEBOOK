import express from "express";
import {
  handleAddPost,
  handleGetPost,
  handleLike,
  handlecommet,
  handleGetcommet,
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
  "/getposts/:userId",

  auth,
  handleGetPost
);
postRouter.put("/like", auth, handleLike);
postRouter.post("/comment", auth, handlecommet);
postRouter.get("/comment", auth, handleGetcommet);

export default postRouter;
