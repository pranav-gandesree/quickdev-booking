
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      role: 'USER' | 'DEVELOPER'
      hasOnboarded: boolean
    };
    accessToken: string; 
  }

  interface JWT {
    uid: string;
    email: string;
    role: 'USER' | 'DEVELOPER'
    accessToken: string;
  }
}