import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SystemSettings from '@/models/SystemSettings';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        // Allow any authenticated user to read settings? Maybe just admin for full settings.
        // Let's stick to admin for editing, but maybe public for some?
        // For this endpoint: Admin only. Public info should probably be separate or passed to layout.

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let settings = await SystemSettings.findOne();

        if (!settings) {
            settings = await SystemSettings.create({});
        }

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        await dbConnect();

        const settings = await SystemSettings.findOneAndUpdate(
            {},
            {
                ...body,
                updatedBy: session.user.email
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ message: 'Settings updated', settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
