export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'DEVELOPER'; // Assuming roles are either USER or DEVELOPER
    image: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Developer {
    id: string;
    userId: string; 
    bio: string;
    experience: string; 
    hourlyRate: number;
    portfolio: string;
    github: string;
    technologies: string[]; 
    availability: boolean;
    user: User; 
    walletAddress: string
  }
  


  export interface BookingRequest {
    userId: string;
    devId: string;
    date: Date;
    duration: number;
    amount: number;
  }
  
  export interface TwilioVideoRoom {
    id: string;
    token: string;
  }