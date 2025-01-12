import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'; 
import { authOptions } from '@/lib/auth'; 
import prisma from '../../../../prisma/prisma';

export async function GET(request: Request) {
  try {
    // Retrieve session information using getServerSession
    const session = await getServerSession(authOptions); // Pass auth options directly
    if (!session) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },  // Replace with actual user ID or email from session
    });

    if (user) {
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
