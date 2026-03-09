'use client';

import React, { useState, useEffect } from 'react';
import BookingModal from './BookingModal';
import AdminSlotModal from './AdminSlotModal';
import { Search, Filter, MapPin, Car, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Slot {
  id: string;
  slotId: string;
  status: 'vacant' | 'occupied' | 'booked';
  location?: string;
  lastUpdated: string;
}

interface ParkingDashboardProps {
  onBookSlot?: (slotId: string) => void;
  isAdmin?: boolean;
}

const ParkingDashboard: React.FC<ParkingDashboardProps> = ({ onBookSlot, isAdmin = false }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vacant' | 'occupied' | 'booked'>('all');

  useEffect(() => {
    fetchSlots();

    const interval = setInterval(() => {
      fetchSlots(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = slots;
    if (searchTerm) {
      result = result.filter(slot =>
        slot.slotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(slot => slot.status === filterStatus);
    }
    setFilteredSlots(result);
  }, [slots, searchTerm, filterStatus]);

  const fetchSlots = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const response = await fetch('/api/slots');
      const data = await response.json();

      if (response.ok) {
        setSlots(data.slots);
        // We don't setFilteredSlots here anymore because the useEffect above 
        // will automatically run when 'slots' changes, preserving current filters.
      } else {
        setError(data.error || 'Failed to fetch slots');
      }
    } catch (err) {
      setError('Failed to load slots');
      console.error('Error fetching slots:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const getStatusStyles = (status: Slot['status']) => {
    switch (status) {
      case 'vacant':
        return {
          wrapper: 'bg-green-500/10 border-green-500/20 hover:border-green-500/50',
          badge: 'bg-green-500/20 text-green-600 dark:text-green-400',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Vacant'
        };
      case 'occupied':
        return {
          wrapper: 'bg-red-500/10 border-red-500/20 hover:border-red-500/50',
          badge: 'bg-red-500/20 text-red-600 dark:text-red-400',
          icon: <XCircle className="h-4 w-4" />,
          label: 'Occupied'
        };
      case 'booked':
        return {
          wrapper: 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/50',
          badge: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
          icon: <Clock className="h-4 w-4" />,
          label: 'Booked'
        };
      default:
        return {
          wrapper: 'bg-gray-500/10 border-gray-500/20',
          badge: 'bg-gray-500/20 text-gray-600',
          icon: <Car className="h-4 w-4" />,
          label: 'Unknown'
        };
    }
  };

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot.slotId);

    // If vacant, anyone can book (including admins)
    if (slot.status === 'vacant') {
      setIsBookingModalOpen(true);
    }
    // If occupied/booked AND admin, show details
    else if (isAdmin) {
      setIsAdminModalOpen(true);
    }
  };

  const handleBookClick = (slotId: string) => {
    setSelectedSlot(slotId);
    setIsBookingModalOpen(true);
  };

  const handleBooking = async (bookingData: any) => {
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Booking successful!');
        fetchSlots(); // Refresh slots data
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isAdmin ? 'Admin Overview' : 'Live Parking Status'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Manage slots and view booking details' : 'Real-time availability updates'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search details..."
              className="pl-9 pr-4 py-2 rounded-lg bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1 bg-muted rounded-lg border border-border">
            {(['all', 'vacant', 'occupied', 'booked'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filterStatus === status
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
          <p className="flex items-center gap-2 font-medium">
            <XCircle className="h-5 w-5" />
            {error}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSlots.map((slot) => {
              const styles = getStatusStyles(slot.status);
              return (
                <div
                  key={slot.id}
                  className={`relative group rounded-xl border-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-card/50 backdrop-blur-sm cursor-pointer ${styles.wrapper}`}
                  onClick={() => handleSlotClick(slot)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${styles.badge}`}>
                      {styles.icon}
                      {styles.label}
                    </div>
                    {/* User Action Button */}
                    {slot.status === 'vacant' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookClick(slot.slotId);
                        }}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 whitespace-nowrap"
                      >
                        Book Now
                      </button>
                    )}
                    {/* Admin Action Badge */}
                    {isAdmin && slot.status !== 'vacant' && (
                      <span className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded-md whitespace-nowrap">
                        View Details
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-foreground">
                        {slot.slotId}
                      </h3>
                      {slot.location && (
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3" />
                          {slot.location}
                        </div>
                      )}
                    </div>
                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border shadow-sm">
                      <Car className={`h-5 w-5 ${styles.badge.split(' ').pop()}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSlots.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-20" />
              <p>No slots found matching your criteria</p>
            </div>
          )}
        </>
      )}

      {/* Booking Modal (User Only) */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        slotId={selectedSlot || ''}
        onBook={handleBooking}
      />

      {/* Admin Details Modal (Admin Only) */}
      <AdminSlotModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        slotId={selectedSlot || ''}
      />
    </div>
  );
};

export default ParkingDashboard;