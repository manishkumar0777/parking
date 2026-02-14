import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Slot from '@/models/Slot';
import Booking from '@/models/Booking';
import User from '@/models/User';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const slotId = searchParams.get('slotId');

        if (!slotId) {
            return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
        }

        await dbConnect();

        // Find the slot by its display ID (e.g., "A1")
        const slot = await Slot.findOne({ slotId });

        if (!slot) {
            return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
        }

        // If vacant, return basic info
        if (slot.status === 'vacant') {
            return NextResponse.json({
                slotId: slot.slotId,
                status: slot.status,
                lastUpdated: slot.lastUpdated,
            });
        }

        // If occupied or booked, find the active booking
        const booking = await Booking.findOne({
            slotId: slot._id,
            status: 'active', // Assuming 'active' is the status for current bookings
        }).populate('userId', 'name email phone');

        if (!booking) {
            // Slot is marked occupied but no active booking found (manual override or error)
            return NextResponse.json({
                slotId: slot.slotId,
                status: slot.status,
                lastUpdated: slot.lastUpdated,
                info: 'Manually occupied or booking data missing',
            });
        }

        return NextResponse.json({
            slotId: slot.slotId,
            status: slot.status,
            lastUpdated: slot.lastUpdated,
            booking: {
                id: booking._id,
                user: {
                    name: booking.userId.name,
                    email: booking.userId.email,
                    phone: booking.userId.phone,
                },
                vehicleNo: booking.vehicleNo,
                startTime: booking.startTime,
                endTime: booking.endTime,
            },
        });
    } catch (error) {
        console.error('Error fetching admin slot details:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
