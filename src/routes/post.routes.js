import express from "express";
import {
  handleAddPost,
  handleGetPost,
  handleLike,
  handlecommet,
  handleGetcommet,
  handleDeletedPost,
  handleSavepost,
  getSavedPosts,
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
postRouter.delete(
  "/delete/:id",

  auth,
  handleDeletedPost
);
postRouter.post(
  "/save/:id",

  auth,
  handleSavepost
);
postRouter.get(
  "/save",

  auth,
  getSavedPosts
);
postRouter.put("/like", auth, handleLike);
postRouter.post("/comment", auth, handlecommet);
postRouter.get("/comment", auth, handleGetcommet);

export default postRouter;
