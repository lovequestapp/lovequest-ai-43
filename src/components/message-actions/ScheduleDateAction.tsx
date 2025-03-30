
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { ScheduleInfo, getDefaultScheduleDate, formatScheduleMessage } from '@/utils/messageActions';
import { toast } from 'sonner';

interface ScheduleDateActionProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (message: string) => void;
}

const ScheduleDateAction: React.FC<ScheduleDateActionProps> = ({
  isOpen,
  onClose,
  onSchedule
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(getDefaultScheduleDate());
  const [time, setTime] = useState('7:00 PM');
  const [activity, setActivity] = useState('coffee');
  const [location, setLocation] = useState('');

  const handleSchedule = () => {
    if (!activity.trim()) {
      toast.error("Please enter an activity");
      return;
    }

    const scheduleInfo: ScheduleInfo = {
      date: selectedDate,
      time,
      activity,
      location: location.trim() || undefined
    };

    const message = formatScheduleMessage(scheduleInfo);
    onSchedule(message);
    onClose();
    
    toast.success("Date scheduled!", {
      description: `You've proposed a date on ${format(selectedDate, 'MMM d')} at ${time}`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Date</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="activity">Activity</Label>
            <Input
              id="activity"
              placeholder="Coffee, dinner, movie, etc."
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded border pointer-events-auto"
              disabled={(date) => date < new Date()}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              placeholder="7:00 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="Enter a location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSchedule}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDateAction;
