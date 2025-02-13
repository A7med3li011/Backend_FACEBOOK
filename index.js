import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { connection } from "./db/connection.js";
import { handleError } from "./utilities/handleError.js";
import userRoutes from "./src/routes/user.routes.js";

import postRouter from "./src/routes/post.routes.js";
import timeLineRoutes from "./src/routes/timeLine.routes.js";
import storyRoutes from "./src/routes/story.routes.js";

connection();
const app = express();
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/meta/facebook/user", userRoutes);
app.use("/api/meta/facebook/user/post", postRouter);
app.use("/api/meta/facebook/user/timeline", timeLineRoutes);
app.use("/api/meta/facebook/user/story", storyRoutes);
app.all("*", (req, res, next) => {
  next(new handleError(`invalid url ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err)
    return res.status(err.statusCode || 400).json({ message: err.message });
});

const port = process.env.PORT;
app.listen(port || 3001, () => {
  console.log("server on");
});
