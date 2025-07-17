import Joi from "joi";

const answerInputSchema = Joi.object({
  questionnaire_id: Joi.string().hex().length(24).required(),
  client_id: Joi.string().hex().length(24).required(),

  answers: Joi.array().items(
    Joi.object({
      question_id: Joi.string().required(),
      answer: Joi.alternatives().try(
        Joi.string().trim().min(1),
        Joi.number(),
        Joi.boolean(),
        Joi.object(), 
        Joi.array()   
      ).required()
    })
  ).min(1).required(),
});

export { answerInputSchema };
