import { Event, IEvent } from '../models/Event.model';
import redisClient from '../config/redis';

export class EventService {
  private CACHE_EXPIRATION = 3600; // 1 hour in seconds

  public async createEvent(data: Partial<IEvent>, creatorId: string): Promise<IEvent> {
    const event = await Event.create({ ...data, creator: creatorId });
    
    // Invalidate the "all events" cache so the new event shows up immediately for everyone
    await redisClient.del('events:all');
    
    return event;
  }

  public async getAllEvents(): Promise<IEvent[]> {
    // 1. Check Redis Cache layer
    const cachedEvents = await redisClient.get('events:all');
    if (cachedEvents) {
      console.log('Cache hit! Serving from Redis.');
      return JSON.parse(cachedEvents);
    }

    // 2. Cache miss. Hit the Database
    console.log('Cache miss! Hitting the DB.');
    const events = await Event.find({ isPublished: true })
      .populate('creator', 'name email')
      .sort({ date: 1 });

    // 3. Store the result in Redis for the next request
    await redisClient.set('events:all', JSON.stringify(events), 'EX', this.CACHE_EXPIRATION);
    
    return events;
  }

  public async getEventById(eventId: string): Promise<IEvent> {
    const cacheKey = `event:${eventId}`;
    
    // Check Cache
    const cachedEvent = await redisClient.get(cacheKey);
    if (cachedEvent) {
      return JSON.parse(cachedEvent);
    }

    // Hit DB
    const event = await Event.findById(eventId).populate('creator', 'name email');
    if (!event) {
      throw { statusCode: 404, message: 'Event not found' };
    }

    // Save to Cache
    await redisClient.set(cacheKey, JSON.stringify(event), 'EX', this.CACHE_EXPIRATION);
    
    return event;
  }
}