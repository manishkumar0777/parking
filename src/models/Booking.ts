import mongoose, { Document } from 'mongoose';

interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'cancelled';
  vehicleNo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new mongoose.Schema<IBooking>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  vehicleNo: { type: String },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);