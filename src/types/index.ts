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
    user: User; // Nested User object
  }
  