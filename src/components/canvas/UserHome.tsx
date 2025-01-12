'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import BookingModal from './BookingModel';
import { useToast } from '@/hooks/use-toast';
import { Developer } from '@/types';
import DeveloperCard from './DeveloperCard';
import { useSession } from 'next-auth/react';

interface BookingDetails {
  developerId: string;
  date: Date;
  duration: number;
  amount: number;
}


export default function UserHome() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [videoRoom, setVideoRoom] = useState<any>(null);
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    fetchDevelopers();
    console.log("user id is", session?.user.id)
  }, []);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/developers', { cache: 'no-store' }); // Adjust the API endpoint
      if (!response.ok) throw new Error('Failed to fetch developers');

      const data: Developer[] = await response.json();
      setDevelopers(data);
    } catch (error) {
      console.error('Error fetching developers:', error);
      toast({
        title: "Error",
        description: "Failed to load developers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };




  const bookCall = (developerId: string) => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to book a call",
        variant: "destructive"
      });
      return;
    }

    const developer = developers.find(dev => dev.id === developerId);
    if (developer) {
      setSelectedDev(developer);
      setIsBookingModalOpen(true);
    }
  };


  const handleBookingSubmit = async (bookingDetails: BookingDetails) => {
    try {
      // 1. Initiate booking and get video room details
      const response = await fetch('/api/initiate-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user.id,
          devId: bookingDetails.developerId,
          date: bookingDetails.date,
          duration: bookingDetails.duration,
          amount: bookingDetails.amount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate booking');
      }

      const { booking, videoRoom } = await response.json();
      
      // 2. Store video room details
      setVideoRoom(videoRoom);
      setIsBookingModalOpen(false);

      // 3. Show success message with instructions
      toast({
        title: "Booking Successful",
        description: "Your video call room is ready. The payment will be processed after the call ends.",
        duration: 5000
      });


      // 4. Navigate to video call page
      window.location.href = `/call/${booking.id}`;

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking the call. Please try again.",
        variant: "destructive"
      });
    }
  };



 if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }


  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Developers</h1>
      <div className="flex flex-col sm:flex-col lg:flex-col gap-6">
        {developers.map((developer) => (
          <DeveloperCard
          key={developer.id}
          developer={developer}
          onBook={bookCall}
        />
        ))}
      </div>

      {selectedDev && (
        <BookingModal
          developer={selectedDev}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookingSubmit}
        />
      )}

    </div>
  );
}
