import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'user' | 'admin';
  bookings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);