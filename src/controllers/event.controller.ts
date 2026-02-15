import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { createEventSchema } from '../dtos/event.dto';
import { sendResponse } from '../utils/response.util';
import { AuthRequest } from '../interfaces/auth.interface';

const eventService = new EventService();

export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createEventSchema.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    // req.user comes from the protect middleware we built in Step 3
    const event = await eventService.createEvent(value, req.user!.id);
    
    // Create a shareable URL for social media
    const shareableLink = `${req.protocol}://${req.get('host')}/api/v1/events/${event._id}`;

    sendResponse(res, 201, true, 'Event created successfully', { event, shareableLink });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await eventService.getAllEvents();
    sendResponse(res, 200, true, 'Events retrieved successfully', events);
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    
    const shareableLink = `${req.protocol}://${req.get('host')}/api/v1/events/${event._id}`;
    
    sendResponse(res, 200, true, 'Event retrieved successfully', { event, shareableLink });
  } catch (error) {
    next(error);
  }
};