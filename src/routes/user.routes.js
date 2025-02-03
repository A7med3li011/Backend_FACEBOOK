import express from "express";
import { handlRegister,handleVerification ,handlelogin,handleResendEmail} from "../controllers/user.controller.js";
import {  validate } from "../../middleware/validation/validationExcution.js";
import { registerSchema,verification } from "../../middleware/validation/validationSchema.js";
const userRoutes = express.Router();

userRoutes.post("/register", validate(registerSchema), handlRegister);
userRoutes.post("/verified",validate(verification),handleVerification);
userRoutes.post("/login",handlelogin);
userRoutes.post("/resendEmail",handleResendEmail);
export default userRoutes;
