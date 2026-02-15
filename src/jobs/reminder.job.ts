import cron from 'node-cron';
import { Ticket } from '../models/Ticket.model';
import { sendEmail } from '../utils/email.util';

export const startReminderJob = () => {
  // Run this job at minute 0 past every hour (e.g., 1:00, 2:00, 3:00)
  cron.schedule('0 * * * *', async () => {
    console.log('Running Event Reminder Cron Job...');

    try {
      const now = new Date();

      // Find all valid, paid/generated tickets where a reminder hasn't been sent yet
      // We populate the Event and Attendee to get dates, reminders, and emails
      const tickets = await Ticket.find({ reminderSent: false })
        .populate('event', 'title date reminderSet')
        .populate('attendee', 'name email');

      for (const ticket of tickets) {
        const event: any = ticket.event;
        const attendee: any = ticket.attendee;

        // Determine which reminder time to use:
        // If the eventee set a custom reminder, use it. Otherwise, use the creator's default.
        const reminderHours = ticket.userReminder || event.reminderSet;

        // Calculate the exact time the reminder should be sent
        const eventDate = new Date(event.date);
        const reminderTime = new Date(eventDate.getTime() - reminderHours * 60 * 60 * 1000);

        // If the current time has passed the calculated reminder time, send the email!
        if (now >= reminderTime && now < eventDate) {
          const subject = `Upcoming Event Reminder: ${event.title}`;
          const text = `Hi ${attendee.name},\n\nThis is a friendly reminder that "${event.title}" is happening in roughly ${reminderHours} hours!\n\nGet your QR code ready for scanning at the venue.\n\nEnjoy,\nThe Eventful Team`;

          await sendEmail(attendee.email, subject, text);

          // Mark as sent so we don't spam them next hour
          ticket.reminderSent = true;
          await ticket.save();
        }
      }
    } catch (error) {
      console.error('Error in Reminder Cron Job:', error);
    }
  });
};