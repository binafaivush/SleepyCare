import Joi from "joi";

const appointmentValidationSchema = Joi.object({
  client_id: Joi.string().hex().length(24).required(),
  counselor_id: Joi.string().hex().length(24).required(),

  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().greater(Joi.ref('start_time')).required(),

  zoom_link: Joi.string().uri().required(),

  status: Joi.string()
    .valid("scheduled", "completed", "cancelled", "pending")
    .default("pending")
});

export { appointmentValidationSchema };
