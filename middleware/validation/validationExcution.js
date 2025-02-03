import { handleError } from "../../utilities/handleError.js";


// export const normalValidation = (req, res, next) => {
//   const { error } = registerSchema.validate(req.body, { abortEarly: false });

//   if (error) return next(new handleError(error.message, 400));

//   next();
// };

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) return next(new handleError(error.message, 400));

    next();
  };
};
