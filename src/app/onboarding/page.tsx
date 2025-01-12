'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnBoarding from "@/components/canvas/OnBoarding";

const OnBoardingPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserExistence = async () => {
      try {
        const response = await fetch('/api/check-user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.exists) {
            router.push('/home');
          }
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserExistence();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return <OnBoarding />;
}

export default OnBoardingPage;
