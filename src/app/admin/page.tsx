'use client';

import ParkingDashboard from '@/components/ParkingDashboard';

export default function AdminDashboard() {
  return (
    <div className="w-full flex-1 pt-6 px-4">
      <ParkingDashboard isAdmin={true} />
    </div>
  );
}