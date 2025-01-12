import { Twilio } from 'twilio';
import { jwt } from 'twilio';
import prisma from '../../../../prisma/prisma';
import { BookingRequest, TwilioVideoRoom } from '@/types';
import { RoomInstance } from 'twilio/lib/rest/video/v1/room';

const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export async function POST(req: Request) {
  let twilioRoom: RoomInstance | null = null;

  try {
    const bookingRequest: BookingRequest = await req.json();
    const { userId, devId, date, duration, amount } = bookingRequest;
    
    // Validate developer existence
    const developer = await prisma.developerProfile.findUnique({
      where: { id: devId },
      select: { id: true }
    });

    if (!developer) {
      return new Response(
        JSON.stringify({ error: 'Developer not found' }), 
        { status: 404 }
      );
    }

    // Validate user existence
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { status: 404 }
      );
    }

    // Check for existing bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        devId,
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + duration * 60000),
        },
        status: {
          not: 'CANCELLED'
        }
      }
    });

    if (existingBooking) {
      return new Response(
        JSON.stringify({ error: 'Time slot not available' }), 
        { status: 400 }
      );
    }

    // Validate Twilio credentials
    if (!process.env.TWILIO_ACCOUNT_SID || 
        !process.env.TWILIO_AUTH_TOKEN || 
        !process.env.TWILIO_API_KEY || 
        !process.env.TWILIO_API_SECRET) {
      throw new Error('Missing Twilio credentials');
    }

    // Create Twilio client
    const twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Create Twilio room
    twilioRoom = await twilioClient.video.v1.rooms.create({
      uniqueName: `${userId}-${devId}-${Date.now()}`,
      type: 'go',
      statusCallback: '/api/video-webhook',
      statusCallbackMethod: 'POST'
    });

    // Generate access token
    const accessToken = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { identity: userId }
    );

    // Create video grant
    const videoGrant = new VideoGrant({
      room: twilioRoom.sid
    });

    // Add grant to token
    accessToken.addGrant(videoGrant);

    // Generate JWT
    const tokenJwt = accessToken.toJwt();

    // Create booking and payment in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId,
          devId,
          date: new Date(date),
          duration,
          status: 'PENDING',
          videoRoomId: twilioRoom ? twilioRoom.sid : null,
          videoRoomToken: tokenJwt,
        }
      });

      // Create payment
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount,
          currency: 'SOL',
          status: 'PENDING'
        }
      });

      return { booking, payment };
    });

    return new Response(JSON.stringify({
      booking: result.booking,
      payment: result.payment,
      videoRoom: {
        id: twilioRoom.sid,
        token: tokenJwt
      }
    }));

  } catch (error) {
    if (error instanceof Error) {
      console.error('Booking error:', {
        name: error.name,
        message: error.message,
        code: (error as any).code,
        meta: (error as any).meta
      });
    } else {
      console.error('Booking error:', error);
    }

    // Clean up Twilio room if it was created but transaction failed
    if (twilioRoom) {
      try {
        const twilioClient = new Twilio(
          process.env.TWILIO_ACCOUNT_SID!,
          process.env.TWILIO_AUTH_TOKEN!
        );
        await twilioClient.video.v1.rooms(twilioRoom.sid).update({status: 'completed'});
      } catch (cleanupError) {
        console.error('Failed to cleanup Twilio room:', cleanupError);
      }
    }

    if ((error as any).code === 'P2003') {
      return new Response(
        JSON.stringify({ 
          error: 'Database reference error',
          details: (error as any).meta?.field_name 
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to initiate booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
}