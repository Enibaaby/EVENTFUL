import { Event } from '../models/Event.model';
import { Ticket } from '../models/Ticket.model';

export class AnalyticsService {
  
  // 1. All-time Analytics for a Creator
  public async getCreatorDashboard(creatorId: string) {
    // Find all events created by this specific user
    const events = await Event.find({ creator: creatorId }).select('_id');
    const eventIds = events.map(e => e._id);

    // Calculate all-time ticket sales and scans across ALL their events
    const totalTicketsBought = await Ticket.countDocuments({ event: { $in: eventIds } });
    const totalAttendeesScanned = await Ticket.countDocuments({ event: { $in: eventIds }, isScanned: true });

    return {
      totalEventsCreated: events.length,
      totalTicketsBought,
      totalAttendeesScanned,
      overallAttendanceRate: totalTicketsBought > 0 
        ? `${((totalAttendeesScanned / totalTicketsBought) * 100).toFixed(2)}%` 
        : '0%'
    };
  }

  // 2. Specific Analytics for a Single Event
  public async getEventSpecificAnalytics(eventId: string, creatorId: string) {
    // Verify the event belongs to the creator requesting the data
    const event = await Event.findOne({ _id: eventId, creator: creatorId });
    if (!event) {
      throw { statusCode: 404, message: 'Event not found or you are not authorized to view its analytics' };
    }

    const totalTicketsBought = await Ticket.countDocuments({ event: eventId });
    const totalAttendeesScanned = await Ticket.countDocuments({ event: eventId, isScanned: true });

    return {
      eventId: event._id,
      eventTitle: event.title,
      eventCapacity: event.capacity,
      totalTicketsBought,
      totalAttendeesScanned,
      ticketsRemaining: event.capacity - totalTicketsBought,
      eventAttendanceRate: totalTicketsBought > 0 
        ? `${((totalAttendeesScanned / totalTicketsBought) * 100).toFixed(2)}%` 
        : '0%'
    };
  }
}