import { Event } from '../models/Event.model';
import { Ticket, ITicket } from '../models/Ticket.model';
import { initializePayment, verifyPayment } from '../utils/paystack.util';
import QRCode from 'qrcode';

export class TicketService {
  
  public async buyTicket(eventId: string, userId: string, email: string) {
    const event = await Event.findById(eventId);
    if (!event) throw { statusCode: 404, message: 'Event not found' };

    const ticketsSold = await Ticket.countDocuments({ event: eventId });
    if (ticketsSold >= event.capacity) {
      throw { statusCode: 400, message: 'Event is sold out' };
    }

    const existingTicket = await Ticket.findOne({ event: eventId, attendee: userId });
    if (existingTicket) {
      throw { statusCode: 400, message: 'You already have a ticket for this event' };
    }

    const paymentData = await initializePayment(email, event.price, eventId, userId);
    
    return paymentData;
  }

  public async processTicketVerification(reference: string): Promise<ITicket> {
    const paymentDetails = await verifyPayment(reference);

    if (paymentDetails.status !== 'success') {
      throw { statusCode: 400, message: 'Payment was not successful' };
    }

    const { eventId, userId } = paymentDetails.metadata;

    let ticket = await Ticket.findOne({ paymentReference: reference });
    if (ticket) return ticket;

    ticket = new Ticket({
      event: eventId,
      attendee: userId,
      paymentReference: reference,
      qrCode: 'pending', 
    });

    const qrData = JSON.stringify({ ticketId: ticket._id, eventId });
    const qrCodeBase64 = await QRCode.toDataURL(qrData);

    ticket.qrCode = qrCodeBase64;
    await ticket.save();

    return ticket;
  }

  public async scanTicket(ticketId: string, eventId: string, organizerId: string) {
    const event = await Event.findById(eventId);
    if (!event || event.creator.toString() !== organizerId.toString()) {
      throw { statusCode: 403, message: 'You are not authorized to scan tickets for this event' };
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw { statusCode: 404, message: 'Invalid ticket' };
    
    if (ticket.event.toString() !== eventId) {
       throw { statusCode: 400, message: 'Ticket does not belong to this event' };
    }

    if (ticket.isScanned) {
      throw { statusCode: 400, message: 'Ticket has already been scanned and used!' };
    }

    ticket.isScanned = true;
    await ticket.save();

    return ticket;
  }
}