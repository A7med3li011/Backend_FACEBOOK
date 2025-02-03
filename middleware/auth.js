import { handleError } from "../utilities/handleError.js";
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.headers.token;


  if (token) {
    jwt.verify(token, process.env.SECRETEKEY, (err, decode) => {
      if (err) return next(new handleError("token is not valid", 400));
      req.user = decode.user;
      next()
    });
  } else {
    next(new handleError("token is required", 400));
  }
};
