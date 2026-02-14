import mongoose, { Document } from 'mongoose';

interface ISlot extends Document {
  slotId: string;
  status: 'vacant' | 'occupied' | 'booked';
  deviceId: string;
  location?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new mongoose.Schema<ISlot>({
  slotId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['vacant', 'occupied', 'booked'], default: 'vacant' },
  deviceId: { type: String, required: true },
  location: { type: String }, // e.g., "Floor 1, Slot A1"
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Slot || mongoose.model<ISlot>('Slot', SlotSchema);