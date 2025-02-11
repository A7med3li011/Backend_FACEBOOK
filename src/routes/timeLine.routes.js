import express from "express";
import { handleGetTimeline } from "../controllers/timeLine.controller.js";

const timeLineRoutes = express.Router();

timeLineRoutes.get("/",handleGetTimeline)

export default timeLineRoutes
