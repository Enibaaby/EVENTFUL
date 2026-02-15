import { Event } from '../models/Event.model';
import { Ticket, ITicket } from '../models/Ticket.model';
import { initializePayment, verifyPayment } from '../utils/paystack.util';
import QRCode from 'qrcode';

export class TicketService {
  
  // 1. Initialize Purchase
  public async buyTicket(eventId: string, userId: string, email: string) {
    const event = await Event.findById(eventId);
    if (!event) throw { statusCode: 404, message: 'Event not found' };

    // Check capacity
    const ticketsSold = await Ticket.countDocuments({ event: eventId });
    if (ticketsSold >= event.capacity) {
      throw { statusCode: 400, message: 'Event is sold out' };
    }

    // Check if user already has a ticket
    const existingTicket = await Ticket.findOne({ event: eventId, attendee: userId });
    if (existingTicket) {
      throw { statusCode: 400, message: 'You already have a ticket for this event' };
    }

    // Initialize Paystack payment
    // Note: If the event is free (price = 0), you would skip Paystack and generate the ticket directly. 
    // For this module, we assume paid events to satisfy the Paystack requirement.
    const paymentData = await initializePayment(email, event.price, eventId, userId);
    
    return paymentData; // Return authorization URL to the client
  }

  // 2. Verify Payment & Generate Ticket with QR Code
  public async processTicketVerification(reference: string): Promise<ITicket> {
    const paymentDetails = await verifyPayment(reference);

    if (paymentDetails.status !== 'success') {
      throw { statusCode: 400, message: 'Payment was not successful' };
    }

    const { eventId, userId } = paymentDetails.metadata;

    // Check if ticket already exists to prevent duplicate creation on multiple webhook/verify hits
    let ticket = await Ticket.findOne({ paymentReference: reference });
    if (ticket) return ticket;

    // Create a temporary ticket record to get the ID
    ticket = new Ticket({
      event: eventId,
      attendee: userId,
      paymentReference: reference,
      qrCode: 'pending', 
    });

    // Generate QR Code containing the ticket ID
    const qrData = JSON.stringify({ ticketId: ticket._id, eventId });
    const qrCodeBase64 = await QRCode.toDataURL(qrData);

    ticket.qrCode = qrCodeBase64; // Save the base64 image string
    await ticket.save();

    return ticket;
  }

  // 3. Scan & Validate QR Code
  public async scanTicket(ticketId: string, eventId: string, organizerId: string) {
    // Ensure the person scanning is the actual creator of the event
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

    // Mark as scanned (Requirement: Analytics)
    ticket.isScanned = true;
    await ticket.save();

    return ticket;
  }
}