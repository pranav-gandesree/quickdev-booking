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
    userId: string; // Reference to the User
    bio: string;
    experience: string; // Number of years as a string
    hourlyRate: number;
    portfolio: string;
    github: string;
    technologies: string[]; // Array of technologies
    availability: boolean;
    user: User; // Nested User object
  }
  