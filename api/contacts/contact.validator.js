import Joi from "@hapi/joi";

const userValidSchema = Joi.object({
  email: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});

export const userValidateMiddleware = (req, res, next) => {
  const result = userValidSchema.validate(req.body);
  console.log(result.error);
  if (result.error) {
    res.status(400).send("Bad request");
    return;
  }

  next();
};
