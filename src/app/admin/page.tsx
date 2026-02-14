'use client';

import ParkingDashboard from '@/components/ParkingDashboard';
import Link from 'next/link';
import { Users, Calendar, Settings } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, bookings, and system settings.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin/users" className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded-lg font-medium transition-colors">
            <Users className="h-4 w-4" />
            View All Users
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg font-medium transition-colors">
            <Calendar className="h-4 w-4" />
            Manage Bookings
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 rounded-lg font-medium transition-colors">
            <Settings className="h-4 w-4" />
            System Settings
          </Link>
        </div>
      </div>

      {/* Main Dashboard */}
      <ParkingDashboard isAdmin={true} />
    </div>
  );
}