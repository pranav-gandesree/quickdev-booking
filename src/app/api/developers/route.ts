import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

export async function GET() {
  try {
    const developers = await prisma.developerProfile.findMany(
        {
            include: {
                user: true
            }
        }
    );
    // console.log(developers);

    return NextResponse.json(developers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch developers.' }, { status: 500 });
  }
}