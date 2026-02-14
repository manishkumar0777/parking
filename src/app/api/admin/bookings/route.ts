import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';

// GET all bookings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const bookings = await Booking.find({})
            .populate('userId', 'name email')
            .populate('slotId', 'slotId location')
            .sort({ createdAt: -1 });

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH to cancel/complete booking
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { bookingId, status } = await request.json();

        await dbConnect();

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // If cancelling/completing an active booking, free the slot
        if (booking.status === 'active' && (status === 'cancelled' || status === 'completed')) {
            await Slot.findByIdAndUpdate(booking.slotId, { status: 'vacant' });
        }

        booking.status = status;
        await booking.save();

        return NextResponse.json({ message: 'Booking updated', booking });
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
