'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface BookingProps {
  id: string;
  user: {
    name: string;
    email: string;
  };
  date: string;
  time: string;
  createdAt: string;
}

export default function DeveloperBookings() {
  const { data: session } = useSession();
  const userId = session?.user?.id; 
  const role = session?.user?.role;
  const isDeveloper = role === 'DEVELOPER'; 

  const [bookings, setBookings] = useState<BookingProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isDeveloper && userId) fetchBookings(userId); // Use userId as devId if role is DEVELOPER
  }, [isDeveloper, userId]);

  const fetchBookings = async (developerId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${developerId}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch bookings');

      const data: BookingProps[] = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isDeveloper) {
    return (
      <div className="text-white text-center">
        You are not authorized to view this page.
      </div>
    );
  }

  if (loading) return <div className="text-white text-center">Loading bookings...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Developer's Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-white text-center">No bookings yet.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-gray-800 text-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{booking.user.name}</p>
                <p className="text-sm text-gray-400">{booking.user.email}</p>
                <p className="text-sm text-gray-400">
                  Date: {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">Time: {booking.time}</p>
              </div>
              <p className="text-sm text-gray-500">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
