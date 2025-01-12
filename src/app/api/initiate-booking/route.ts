// types.ts
interface BookingRequest {
    userId: string;
    devId: string;
    date: Date;
    duration: number;
    amount: number;
  }
  
  import { Twilio } from 'twilio';
  import { jwt } from 'twilio';
  import prisma from '../../../../prisma/prisma';
  
  const AccessToken = jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  
  export async function POST(req: Request) {
    try {
      const { userId, devId, date, duration, amount }: BookingRequest = await req.json();
  
      // 1. Check developer availability
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
        return new Response(JSON.stringify({ error: 'Time slot not available' }), { 
          status: 400 
        });
      }
  
      // 2. Generate Twilio video room and token
      const twilioClient = new Twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
  
      const room = await twilioClient.video.v1.rooms.create({
        uniqueName: `${userId}-${devId}-${Date.now()}`,
        type: 'go',
        statusCallback: '/api/video-webhook', // Webhook for call status updates
        statusCallbackMethod: 'POST'
      });
  
      // Create an Access Token
      const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_API_KEY!,
        process.env.TWILIO_API_SECRET!,
        { identity: userId }  // Add identity for the user
      );
  
      // Create a Video grant and add it to the token
      const videoGrant = new VideoGrant({ room: room.sid });
      token.addGrant(videoGrant);
  
      // 3. Create booking with PENDING status
      const booking = await prisma.booking.create({
        data: {
          userId,
          devId,
          date: new Date(date),
          duration,
          status: 'PENDING',
          videoRoomId: room.sid,
          videoRoomToken: token.toJwt()
        }
      });
  
      // 4. Create pending payment record
      const payment = await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount,
          currency: 'SOL',
          status: 'PENDING'
        }
      });
  
      return new Response(JSON.stringify({
        booking,
        payment,
        videoRoom: {
          id: room.sid,
          token: token.toJwt()
        }
      }));
  
    } catch (error) {
      console.error('Booking initiation error:', error);
      return new Response(JSON.stringify({ error: 'Failed to initiate booking' }), {
        status: 500
      });
    }
  }