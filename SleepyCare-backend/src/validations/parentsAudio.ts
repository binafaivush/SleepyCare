import Joi from "joi";

export const audioUploadValidationSchema = Joi.object({
  client_id: Joi.string().hex().length(24).required(),
});
