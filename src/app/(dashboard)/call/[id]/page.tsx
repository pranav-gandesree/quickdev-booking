// app/call/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VideoCallPage from '@/components/canvas/VideoCallPage';
import { useToast } from '@/hooks/use-toast';
import { Developer } from '@/types';


export interface BookingData {
    id: string;
    videoRoomToken: string;
    developer: Developer;
    amount: number;
  }

  

export default function CallRoute() {
  const params = useParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch booking data');
        
        const data = await response.json();
        setBookingData(data);
      } catch (error) {
        console.error('Error fetching booking data:', error);
        toast({
          title: "Error",
          description: "Failed to load booking details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Booking Not Found</h2>
          <p className="mt-2">This booking may have expired or been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <VideoCallPage
      bookingId={bookingData.id}
      videoToken={bookingData.videoRoomToken}
      developerWallet={bookingData.developer.walletAddress}
      amount={bookingData.amount}
    />
  );
}