import { NextResponse } from 'next/server';
import Slot from '@/models/Slot';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();

    const slots = await Slot.find({}).sort({ slotId: 1 });

    const formattedSlots = slots.map(slot => ({
      id: slot._id.toString(),
      slotId: slot.slotId,
      status: slot.status,
      location: slot.location,
      lastUpdated: slot.lastUpdated,
    }));

    return NextResponse.json({ slots: formattedSlots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slotId, status } = body;

    if (!slotId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: slotId and status' },
        { status: 400 }
      );
    }

    if (!['vacant', 'occupied', 'booked'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: vacant, occupied, booked' },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedSlot = await Slot.findOneAndUpdate(
      { slotId },
      {
        status,
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!updatedSlot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Slot ${slotId} status updated to ${status}`,
      slot: {
        slotId: updatedSlot.slotId,
        status: updatedSlot.status,
        lastUpdated: updatedSlot.lastUpdated
      }
    });

  } catch (error) {
    console.error('Error updating slot status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}