import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticket.service';
import { buyTicketSchema, scanTicketSchema } from '../dtos/ticket.dto';
import { sendResponse } from '../utils/response.util';
import { AuthRequest } from '../interfaces/auth.interface';
import { Ticket } from '../models/Ticket.model'; // <--- The missing import!

const ticketService = new TicketService();

export const buyTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = buyTicketSchema.validate(req.body);
    if (error) return sendResponse(res, 400, false, error.details[0].message);

    const paymentData = await ticketService.buyTicket(value.eventId, req.user!.id, req.user!.email);

    sendResponse(res, 200, true, 'Payment initialized. Please complete payment using the authorization_url', paymentData);
  } catch (error) {
    next(error);
  }
};

export const verifyTicketPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reference } = req.query;
    if (!reference) return sendResponse(res, 400, false, 'Payment reference is required');

    const ticket = await ticketService.processTicketVerification(reference as string);

    sendResponse(res, 201, true, 'Payment verified and ticket generated successfully', ticket);
  } catch (error) {
    next(error);
  }
};

export const scanTicket = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = scanTicketSchema.validate(req.body);
    if (error) return sendResponse(res, 400, false, error.details[0].message);

    const { eventId } = req.body; 

    const ticket = await ticketService.scanTicket(value.ticketId, eventId, req.user!.id);

    sendResponse(res, 200, true, 'Ticket verified and admitted successfully', ticket);
  } catch (error) {
    next(error);
  }
};

export const setCustomReminder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { ticketId, reminderHours } = req.body;

    if (!ticketId || !reminderHours) {
      return sendResponse(res, 400, false, 'Ticket ID and reminderHours are required');
    }

    const ticket = await Ticket.findOne({ _id: ticketId, attendee: req.user!.id });
    
    if (!ticket) {
      return sendResponse(res, 404, false, 'Ticket not found or does not belong to you');
    }

    ticket.userReminder = Number(reminderHours);
    await ticket.save();

    sendResponse(res, 200, true, `Reminder successfully set to ${reminderHours} hours before the event`, ticket);
  } catch (error) {
    next(error);
  }
};