import Joi from "@hapi/joi";

export const LognValidation = async (body) => {
  const result = await Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).validate(body);
  return result;
};
