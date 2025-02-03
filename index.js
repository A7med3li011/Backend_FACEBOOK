import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import express from "express";
import { connection } from "./db/connection.js";
import { handleError } from "./utilities/handleError.js";
import userRoutes from "./src/routes/user.routes.js";
import { sender } from "./services/sendEmail.js";

connection();
const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/meta/facebook/user", userRoutes);
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
