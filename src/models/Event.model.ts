import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  creator: mongoose.Types.ObjectId;
  capacity: number;
  price: number;
  reminderSet: number; // e.g., 24 for 1 day before, 168 for 1 week before (in hours)
  isPublished: boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    capacity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, default: 0 }, // 0 means free event
    reminderSet: { type: Number, default: 24 }, // Default reminder 24 hours before
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexing for faster queries (especially helpful when adding cache later)
eventSchema.index({ date: 1, creator: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);