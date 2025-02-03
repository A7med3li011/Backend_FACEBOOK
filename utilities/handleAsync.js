import { handleError } from "./handleError.js";

export const handleAsync = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch((err) => next(new handleError(err.message, 400)));
  };
};

