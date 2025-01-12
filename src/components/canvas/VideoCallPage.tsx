'use client';

import { useEffect, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { connect, Room, LocalTrack, RemoteParticipant } from 'twilio-video';

interface VideoCallPageProps {
  bookingId: string;
  videoToken: string;
  developerWallet: string;
  amount: number;
}

export default function VideoCallPage({ 
  bookingId, 
  videoToken, 
  developerWallet, 
  amount 
}: VideoCallPageProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    connectToRoom();
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, []);

  const connectToRoom = async () => {
    try {
      const videoRoom = await connect(videoToken, {
        name: bookingId,
        video: true,
        audio: true
      });

      setRoom(videoRoom);
      setIsConnecting(false);

      // Handle local participant
      videoRoom.localParticipant.tracks.forEach(track => {
        if (track.kind === 'video' && localVideoRef.current) {
          const videoElement = (track.track as any).attach();
          localVideoRef.current.appendChild(videoElement);
        }
      });

      // Handle remote participant
      const handleParticipantConnected = (participant: RemoteParticipant) => {
        participant.tracks.forEach(track => {
          if (track.kind === 'video' && remoteVideoRef.current) {
            const videoElement = (track.track as any).attach();
            remoteVideoRef.current.appendChild(videoElement);
          }
        });
      };

      videoRoom.on('participantConnected', handleParticipantConnected);
      videoRoom.participants.forEach(handleParticipantConnected);

    } catch (error) {
      console.error('Error connecting to video room:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the video call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleVideo = () => {
    room?.localParticipant.videoTracks.forEach(track => {
      if (track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
    });
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    room?.localParticipant.audioTracks.forEach(track => {
      if (track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
    });
    setIsAudioEnabled(!isAudioEnabled);
  };

  const endCall = () => {
    room?.disconnect();
    setIsCallEnded(true);
  };

  const processPayment = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to process the payment",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingPayment(true);
    try {
        const connection = new Connection('https://api.devnet.solana.com');
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(developerWallet),
          lamports: amount * LAMPORTS_PER_SOL
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      // Update payment status on backend
      await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          signature
        })
      });

      setPaymentComplete(true);
      toast({
        title: "Payment Successful",
        description: "Thank you for using our service!",
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-lg">Connecting to video call...</p>
        </div>
      </div>
    );
  }

  if (isCallEnded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">Call Ended</h2>
          
          {!paymentComplete ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                Please process the payment to complete the session
              </p>
              <p className="text-center text-lg font-semibold">
                Amount: {amount} SOL
              </p>
              <Button 
                className="w-full" 
                onClick={processPayment}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                ) : (
                  'Process Payment'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-green-600 font-semibold">
                Payment Completed Successfully
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <div className="relative rounded-lg overflow-hidden bg-gray-800">
          <video ref={localVideoRef} className="w-full h-full"></video>
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            You
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden bg-gray-800">
          <video ref={remoteVideoRef} className="w-full h-full"></video>
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            Developer
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVideo}
            className={!isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {isVideoEnabled ? <Video /> : <VideoOff />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleAudio}
            className={!isAudioEnabled ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={endCall}
          >
            <PhoneOff />
          </Button>
        </div>
      </div>
    </div>
  );
}