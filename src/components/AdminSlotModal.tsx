'use client';

import { useState, useEffect } from 'react';
import { X, User, Car, Calendar, Phone, Mail, Clock, AlertCircle } from 'lucide-react';

interface AdminSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    slotId: string;
}

interface SlotDetails {
    slotId: string;
    status: string;
    lastUpdated: string;
    booking?: {
        id: string;
        user: {
            name: string;
            email: string;
            phone?: string;
        };
        vehicleNo: string;
        startTime: string;
        endTime: string;
    };
    info?: string;
}

export default function AdminSlotModal({ isOpen, onClose, slotId }: AdminSlotModalProps) {
    const [details, setDetails] = useState<SlotDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && slotId) {
            fetchDetails();
        }
    }, [isOpen, slotId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`/api/admin/slot-details?slotId=${slotId}`);
            const data = await response.json();

            if (response.ok) {
                setDetails(data);
            } else {
                setError(data.error || 'Failed to fetch details');
            }
        } catch (err) {
            setError('Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Slot {slotId} Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Status: <span className="font-medium uppercase">{details?.status || 'Loading...'}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <p className="text-sm text-muted-foreground">Loading specific details...</p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-2 p-4 text-destructive bg-destructive/10 rounded-lg">
                            <AlertCircle className="h-5 w-5" />
                            <p>{error}</p>
                        </div>
                    ) : details?.booking ? (
                        <div className="space-y-6">
                            {/* User Info */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">User Information</h3>
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border/50">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{details.booking.user.name}</p>
                                            <p className="text-xs text-muted-foreground">Registered User</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="truncate" title={details.booking.user.email}>{details.booking.user.email}</span>
                                        </div>
                                        {details.booking.user.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{details.booking.user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle & Time Info */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Booking Details</h3>
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border/50">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Car className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-lg tracking-wide">{details.booking.vehicleNo}</p>
                                            <p className="text-xs text-muted-foreground">Vehicle Number</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Start Time
                                            </div>
                                            <p className="text-sm font-medium">
                                                {new Date(details.booking.startTime).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                End Time
                                            </div>
                                            <p className="text-sm font-medium">
                                                {new Date(details.booking.endTime).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                <Car className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Slot is {details?.status}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {details?.info || "No active booking found for this slot."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-border bg-muted/10">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-background border border-border hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
