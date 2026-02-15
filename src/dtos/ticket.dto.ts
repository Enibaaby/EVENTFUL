import Joi from 'joi';

export const buyTicketSchema = Joi.object({
  eventId: Joi.string().hex().length(24).required() // Validates MongoDB ObjectId
});

export const scanTicketSchema = Joi.object({
  ticketId: Joi.string().hex().length(24).required()
});