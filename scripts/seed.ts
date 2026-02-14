import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Slot from '../src/models/Slot';
import User from '../src/models/User';
import dbConnect from '../src/lib/db';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parking';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('📡 Connected to MongoDB');

    // Clear existing data
    await Slot.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create parking slots
    const slots = [
      {
        slotId: 'A001',
        status: 'vacant',
        location: 'Ground Floor - Section A',
        deviceId: 'DEVICE_A001',
      },
      {
        slotId: 'A002',
        status: 'occupied',
        location: 'Ground Floor - Section A',
        deviceId: 'DEVICE_A002',
      },
      {
        slotId: 'B001',
        status: 'booked',
        location: 'First Floor - Section B',
        deviceId: 'DEVICE_B001',
      },
      {
        slotId: 'B002',
        status: 'vacant',
        location: 'First Floor - Section B',
        deviceId: 'DEVICE_B002',
      },
    ];

    const createdSlots = await Slot.insertMany(slots);
    console.log(`✅ Created ${createdSlots.length} parking slots`);

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    // Create users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@parking.com',
        phone: '+1234567890',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'user@parking.com',
        phone: '+0987654321',
        password: userPassword,
        role: 'user',
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin:');
    console.log('  Email: admin@parking.com');
    console.log('  Password: admin123');
    console.log('  Role: admin');
    console.log('\nUser:');
    console.log('  Email: user@parking.com');
    console.log('  Password: user123');
    console.log('  Role: user');

    console.log('\n🏗️  Parking Slots Created:');
    slots.forEach(slot => {
      console.log(`  ${slot.slotId}: ${slot.status} (${slot.location})`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seedDatabase();