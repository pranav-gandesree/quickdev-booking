import React, { useState, useEffect } from 'react';
import { Camera, Mic, MicOff, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const VideoChat = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // These states would be populated by Twilio in the actual implementation
  const [participants, setParticipants] = useState<{ identity: string }[]>([]);
  const [room, setRoom] = useState(null);

  // Placeholder for Twilio room connection
  const connectToRoom = async () => {
    try {
      // In actual implementation, you would:
      // 1. Get token from your backend
      // 2. Connect to Twilio room using:
      // const room = await connect('your-token', {
      //   name: 'room-name',
      //   audio: isAudioEnabled,
      //   video: isVideoEnabled
      // });
      setIsConnected(true);
      // Simulating a participant for demo
      setParticipants([{ identity: 'Demo User' }]);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // In actual implementation:
    // room.localParticipant.audioTracks.forEach(track => {
    //   track.track.enable(!isAudioEnabled);
    // });
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In actual implementation:
    // room.localParticipant.videoTracks.forEach(track => {
    //   track.track.enable(!isVideoEnabled);
    // });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative">
            <div className="bg-gray-800 w-full h-64 rounded-lg flex items-center justify-center">
              {isVideoEnabled ? (
                <div className="text-white">Local Video Stream</div>
              ) : (
                <VideoOff className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-gray-900 text-white px-2 py-1 rounded-md text-sm">
                You
              </span>
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative">
            <div className="bg-gray-800 w-full h-64 rounded-lg flex items-center justify-center">
              <div className="text-white">Remote Video Stream</div>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-gray-900 text-white px-2 py-1 rounded-md text-sm">
                {participants[0]?.identity || 'Waiting...'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant={isAudioEnabled ? 'default' : 'destructive'}
            size="icon"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button
            variant={isVideoEnabled ? 'default' : 'destructive'}
            size="icon"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Camera className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button
            variant={isConnected ? 'destructive' : 'default'}
            onClick={isConnected ? () => setIsConnected(false) : connectToRoom}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VideoChat;