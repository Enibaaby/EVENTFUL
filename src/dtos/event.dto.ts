import Joi from 'joi';

export const createEventSchema = Joi.object({
  title: Joi.string().required().min(3),
  description: Joi.string().required().min(10),
  date: Joi.date().iso().greater('now').required(),
  location: Joi.string().required(),
  capacity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  reminderSet: Joi.number().valid(24, 48, 168).default(24) // Hours before event (e.g., 1 day, 2 days, 1 week)
});