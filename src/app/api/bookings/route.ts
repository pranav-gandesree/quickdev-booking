import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { developerId } = req.query;

  if (req.method === 'GET') {
    try {
      if (!developerId || typeof developerId !== 'string') {
        return res.status(400).json({ message: 'Developer ID is required' });
      }

      const bookings = await prisma.booking.findMany({
        where: { devId: developerId },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
