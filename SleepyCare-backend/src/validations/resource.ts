import Joi from "joi";

const resourceValidationSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(10).required(),
    type: Joi.string().valid("article", "video", "link").required(),
    url: Joi.string()
        .uri()
        .when("type", { is: "video", then: Joi.required() }),
    uploaded_by: Joi.string().hex().length(24).optional()
    ,
    visible_to_clients: Joi.boolean().optional().default(true),
});

export { resourceValidationSchema };
