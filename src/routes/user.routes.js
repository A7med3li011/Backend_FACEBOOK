import express from "express";
import {
  handlRegister,
  handleVerification,
  handlelogin,
  handleResendEmail,
  handleDetials,
  handleGetUser,
  handleProfilePic,
  handlecoverPic,
  handleSearchUser,
  handleSendFriendRequest,
  handleacceptRequest,
  handleIgnoreRequest,
  handleRemoveFreind,
} from "../controllers/user.controller.js";
import {
  validate,
  validateSingleImage,
} from "../../middleware/validation/validationExcution.js";
import {
  detailsSchema,
  registerSchema,
  singleImageSchema,
  verification,
} from "../../middleware/validation/validationSchema.js";
import { auth } from "../../middleware/auth.js";
import { multer4server } from "../../services/multer.js";
const userRoutes = express.Router();

userRoutes.post("/register", validate(registerSchema), handlRegister);
userRoutes.post("/verified", validate(verification), handleVerification);
userRoutes.post("/login", handlelogin);
userRoutes.post("/resendEmail", handleResendEmail);
userRoutes.post("/detials", auth, validate(detailsSchema), handleDetials);
userRoutes.get("/user/:id", auth, handleGetUser);
userRoutes.post(
  "/profilePic",
  multer4server().array("profilePic"),
  auth,
  validateSingleImage(singleImageSchema),
  handleProfilePic
);
userRoutes.post(
  "/coverPic",
  multer4server().array("coverPic"),
  auth,
  validateSingleImage(singleImageSchema),
  handlecoverPic
);
userRoutes.post("/searchUser", handleSearchUser);
userRoutes.post("/sendFriendRequest/:id", auth, handleSendFriendRequest);
userRoutes.post("/ignoreRequst/:id", auth, handleIgnoreRequest);
userRoutes.post("/acceptRequest/:id", auth, handleacceptRequest);
userRoutes.post("/removeFriend/:id", auth, handleRemoveFreind);

export default userRoutes;
