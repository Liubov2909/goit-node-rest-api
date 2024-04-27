import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  phone: Joi.string().required().pattern(/^[0-9]{10}$/),
});

export const updateContactSchema = Joi.object({
 name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
})
  .min(1)
  .message("Body must have at least one field");