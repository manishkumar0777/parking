'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, Calendar, Car, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

interface BookingData {
    _id: string;
    userId: { name: string; email: string };
    slotId: { slotId: string; location?: string };
    vehicleNo: string;
    startTime: string;
    endTime: string;
    status: 'active' | 'completed' | 'cancelled';
    createdAt: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        let result = bookings;

        // Filter by search
        if (searchTerm) {
            result = result.filter(b =>
                (b.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (b.vehicleNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (b.slotId?.slotId || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(b => b.status === statusFilter);
        }

        setFilteredBookings(result);
    }, [searchTerm, statusFilter, bookings]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/bookings');
            const data = await res.json();
            if (res.ok) {
                setBookings(data.bookings);
                setFilteredBookings(data.bookings);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (bookingId: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, status: newStatus }),
            });

            if (res.ok) {
                fetchBookings(); // Refresh data
            } else {
                alert('Failed to update booking status');
            }
        } catch (error) {
            console.error('Error updating booking', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>;
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Completed</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Cancelled</span>;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin"
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Booking Management</h1>
                    <p className="text-muted-foreground">Monitor and manage parking reservations</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search user, vehicle, or slot..."
                            className="pl-9 pr-4 py-2 w-full rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${statusFilter === status
                                        ? 'bg-background shadow-sm text-foreground border border-border'
                                        : 'text-muted-foreground hover:bg-background/50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-3 font-medium text-muted-foreground">User / Vehicle</th>
                                <th className="px-6 py-3 font-medium text-muted-foreground">Slot</th>
                                <th className="px-6 py-3 font-medium text-muted-foreground">Duration</th>
                                <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No bookings found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-foreground">{booking.userId.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <Car className="h-3 w-3" />
                                                    {booking.vehicleNo}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center font-bold text-xs px-1 text-center">
                                                    {booking.slotId?.slotId || 'Del'}
                                                </div>
                                                {booking.slotId?.location && (
                                                    <span className="text-xs text-muted-foreground hidden lg:inline-block">
                                                        {booking.slotId.location}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium">From:</span>
                                                    {new Date(booking.startTime).toLocaleDateString()} {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium">To:</span>
                                                    {new Date(booking.endTime).toLocaleDateString()} {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {booking.status === 'active' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateStatus(booking._id, 'completed')}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(booking._id, 'cancelled')}
                                                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                                        title="Cancel Booking"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
