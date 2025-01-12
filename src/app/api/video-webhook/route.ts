
// api/video-webhook/route.ts
import prisma from "../../../../prisma/prisma";

export async function POST(req: Request) {
    const { RoomSid, RoomStatus, RoomDuration } = await req.json();
  
    if (RoomStatus === 'completed') {
      const booking = await prisma.booking.findFirst({
        where: { videoRoomId: RoomSid }
      });
  
      if (booking) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: 'COMPLETED' }
        });
  
        // Now we can process the payment
        return new Response(JSON.stringify({ 
          status: 'success',
          message: 'Call completed, payment can be processed'
        }));
      }
    }
  }