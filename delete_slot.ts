import mongoose from 'mongoose';
import Slot from './src/models/Slot';

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/parking');
  await Slot.deleteOne({ slotId: 'B002' });
  console.log('Deleted slot B002');
  await mongoose.disconnect();
}

main().catch(console.error);
