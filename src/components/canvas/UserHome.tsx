'use client';

import { useEffect, useState } from 'react';

const UserHome = () => {

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/developers');
      const data = await response.json();
      setDevelopers(data);
      console.log("response is",data);
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
    }
  };


  const bookCall = (developerId: string) => {
    alert(`Booking a call with Developer ID: ${developerId}`);
    // Add booking logic here
  };

  if (loading) return <div>Loading developers...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Developers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {developers.map((developer: any) => (
          <div
            key={developer.id}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <h2 className="text-lg font-semibold">{developer?.user.name}</h2>
            <p className="text-sm text-gray-600">{developer.technologies.join(', ')}</p>
            <div className="flex items-center justify-between mt-4">
          
                {developer.availability ? 'Available' : 'Not Available'}
              <button
                onClick={() => bookCall(developer.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Book a Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserHome