import Joi from 'joi';

const statusEnum = ['approve', 'unapprove', 'waiting'];
const roleEnum = ['parent', 'counselor', 'admin'];

export const userValidationSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password_hash: Joi.string().min(6).required(),
  role: Joi.string().valid(...roleEnum).required(),
  created_at: Joi.date().optional(),

  status: Joi.string()
    .valid(...statusEnum)
    .default((parent) : string => {
      return parent.role === 'parent' ? 'approve' : 'waiting';
    })
});
