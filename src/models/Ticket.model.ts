import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  event: mongoose.Types.ObjectId;
  attendee: mongoose.Types.ObjectId;
  paymentReference: string; // From Paystack
  qrCode: string; // The generated QR string/URL
  isScanned: boolean; // For analytics (attended vs bought)
}

const ticketSchema = new Schema<ITicket>(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    attendee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentReference: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true },
    isScanned: { type: Boolean, default: false },
    userReminder: { type: Number }, // Eventee's custom reminder in hours
    reminderSent: { type: Boolean, default: false }, // Tracks if the email was sent
  },
  { timestamps: true }
);

// Prevent a user from buying multiple tickets to the same event (optional rule, but good practice)
ticketSchema.index({ event: 1, attendee: 1 }, { unique: true });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);