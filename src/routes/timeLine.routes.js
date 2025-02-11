import express from "express";
import { handleGetTimeline } from "../controllers/timeLine.controller.js";
import { auth } from "../../middleware/auth.js";

const timeLineRoutes = express.Router();

timeLineRoutes.get("/", auth, handleGetTimeline);

export default timeLineRoutes;
