import Joi from "joi";

export const authSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(16),
  subscription: Joi.string(),
});

export const emailSchema = Joi.object({
email: Joi.string().required().email(),
})