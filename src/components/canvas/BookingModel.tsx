'use client';

import { useState } from 'react';
import { Developer } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface BookingModalProps {
  developer: Developer;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingDetails: {
    developerId: string;
    date: Date;
    duration: number;
    amount: number;
  }) => void;
}

export default function BookingModal({
  developer,
  isOpen,
  onClose,
  onSubmit
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState(30); // Default 30 minutes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const amount = (developer.hourlyRate || 0) * (duration / 60);
    
    onSubmit({
      developerId: developer.id,
      date: selectedDate,
      duration,
      amount
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a Call with {developer.user.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Select Date and Time</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date): boolean => date.getTime() < new Date().setHours(0, 0, 0, 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Estimated Cost</Label>
            <p className="text-lg font-semibold">
              ${((developer.hourlyRate || 0) * (duration / 60)).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedDate}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}