'use client';

import { useEffect, useState } from 'react';

import { Developer } from '@/types';
import DeveloperCard from './DeveloperCard';

export default function UserHome() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDevelopers();
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
    } finally {
      setLoading(false);
    }
  };

  const bookCall = (developerId: string) => {
    alert(`Booking a call with Developer ID: ${developerId}`);
    // Add your booking logic here
  };

  if (loading) return <div>Loading developers...</div>;

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Developers</h1>
      <div className="flex flex-col sm:flex-col lg:flex-col gap-6">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> */}
        {developers.map((developer) => (
          // <div
          //   key={dev.id}
          //   className="border p-4 rounded-lg shadow-md flex flex-col items-center"
          // >
          //   <Image
          //     src={dev.user.image}
          //     alt={`${dev.user.name}'s profile picture`}
          //     width={80}
          //     height={80}
          //     className="rounded-full"
          //   />
          //   <h2 className="text-lg font-semibold mt-4">{dev.user.name}</h2>
          //   <p className="text-sm text-gray-600">{dev.bio}</p>
          //   <p className="text-sm mt-2">
          //     Experience: <span className="font-medium">{dev.experience} years</span>
          //   </p>
          //   <p className="text-sm mt-2">
          //     Hourly Rate: <span className="font-medium">${dev.hourlyRate}/hr</span>
          //   </p>
          //   <p className="text-sm mt-2">
          //     Technologies: <span className="font-medium">{dev.technologies.join(', ')}</span>
          //   </p>
          //   <div className="flex mt-4 gap-4">
          //     <a
          //       href={dev.github}
          //       target="_blank"
          //       rel="noopener noreferrer"
          //       className="text-blue-500 underline"
          //     >
          //       GitHub
          //     </a>
          //     <a
          //       href={dev.portfolio}
          //       target="_blank"
          //       rel="noopener noreferrer"
          //       className="text-blue-500 underline"
          //     >
          //       Portfolio
          //     </a>
          //   </div>
          //   <button
          //     className={`mt-4 px-4 py-2 text-white rounded ${
          //       dev.availability ? 'bg-green-500' : 'bg-gray-500'
          //     }`}
          //     disabled={!dev.availability}
          //     onClick={() => bookCall(dev.id)}
          //   >
          //     {dev.availability ? 'Book a Call' : 'Not Available'}
          //   </button>
          // </div>

          <DeveloperCard
          key={developer.id}
          developer={developer}
          onBook={bookCall}
        />
        ))}
      </div>
    </div>
  );
}
