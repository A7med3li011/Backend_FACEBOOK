import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().required().min(3).max(10),
  SurName: Joi.string().required().min(3).max(10),
  gender: Joi.string().required().valid("male", "female"),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(30),
  birthDate: Joi.date().max("1-1-2013").required(),
});
export const detailsSchema = Joi.object({
  work: Joi.string().min(3).max(30),
  live: Joi.string().min(3).max(30),
  Studied: Joi.string().min(3).max(50),
  from: Joi.string().min(3).max(30),
});

export const verification = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required().min(5).max(5),
});
