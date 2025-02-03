import express from "express";
import {
  handlRegister,
  handleVerification,
  handlelogin,
  handleResendEmail,
  handleDetials,
} from "../controllers/user.controller.js";
import { validate } from "../../middleware/validation/validationExcution.js";
import {
    detailsSchema,
  registerSchema,
  verification,
} from "../../middleware/validation/validationSchema.js";
import { auth } from "../../middleware/auth.js";
const userRoutes = express.Router();

userRoutes.post("/register", validate(registerSchema), handlRegister);
userRoutes.post("/verified", validate(verification), handleVerification);
userRoutes.post("/login", handlelogin);
userRoutes.post("/resendEmail", handleResendEmail);
userRoutes.post("/detials", auth,validate(detailsSchema), handleDetials);
export default userRoutes;
