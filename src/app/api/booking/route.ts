import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Slot from '@/models/Slot';
import Booking from '@/models/Booking';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { slotId, name, phone, vehicleNo, startTime, endTime } = await request.json();

    if (!slotId || !name || !phone || !vehicleNo || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user from session
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if slot exists and is vacant
    const slot = await Slot.findOne({ slotId });
    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    if (slot.status !== 'vacant') {
      return NextResponse.json({ error: 'Slot is not available' }, { status: 409 });
    }

    // Update user info if changed
    user.name = name;
    user.phone = phone;
    await user.save();

    // Update slot status to booked
    slot.status = 'booked';
    slot.lastUpdated = new Date();
    await slot.save();

    // Create booking record
    const booking = new Booking({
      userId: user._id,
      slotId: slot._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'active',
      vehicleNo
    });
    await booking.save();

    // Update user's bookings
    user.bookings.push(booking._id);
    await user.save();

    // Send webhook to n8n
    const webhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.example.com/webhook/parking-booking';
    const webhookData = {
      phone,
      vehicleNo,
      slotId: slot.slotId,
      location: slot.location,
      startTime,
      endTime,
      userName: user.name,
      userEmail: user.email
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });
    } catch (webhookError) {
      console.error('Webhook failed:', webhookError);
      // Don't fail the booking if webhook fails
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        slotId: slot.slotId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        vehicleNo
      }
    });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}