import mongoose, { Document } from 'mongoose';

interface ISystemSettings extends Document {
    hourlyRate: number;
    currency: string;
    maintenanceMode: boolean;
    appName: string;
    contactEmail: string;
    updatedBy: string; // Admin ID
    updatedAt: Date;
}

const SystemSettingsSchema = new mongoose.Schema<ISystemSettings>({
    hourlyRate: { type: Number, default: 10 },
    currency: { type: String, default: 'USD' },
    maintenanceMode: { type: Boolean, default: false },
    appName: { type: String, default: 'Smart Parking System' },
    contactEmail: { type: String, default: 'admin@example.com' },
    updatedBy: { type: String },
}, { timestamps: true });

// Ensure only one document exists
SystemSettingsSchema.index({}, { unique: true });

export default mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);
