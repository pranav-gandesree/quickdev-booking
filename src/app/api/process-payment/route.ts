
// api/process-payment/route.ts
import prisma from "../../../../prisma/prisma";
import { Connection, PublicKey } from '@solana/web3.js';

export async function POST(req: Request) {
    const { bookingId, signature } = await req.json();
  
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { Payment: true }
      });
  
      if (!booking || booking.status !== 'COMPLETED') {
        throw new Error('Invalid booking or call not completed');
      }
  
      // Verify and process the Solana transaction
      const connection = new Connection(process.env.SOLANA_RPC_URL!);
      const tx = await connection.confirmTransaction(signature);
  
      if (tx.value.err) {
        throw new Error('Transaction failed');
      }
  
      // Update payment status
      await prisma.payment.update({
        where: { id: booking.Payment[0].id },
        data: { 
          status: 'SUCCESS',
          transactionId: signature
        }
      });
  
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Payment processed successfully'
      }));
  
    } catch (error) {
      console.error('Payment processing error:', error);
      return new Response(JSON.stringify({ error: 'Failed to process payment' }), {
        status: 500
      });
    }
  }
 