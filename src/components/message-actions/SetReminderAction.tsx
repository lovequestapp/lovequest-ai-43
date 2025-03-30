
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from 'date-fns';
import { ReminderInfo, saveReminder, formatReminderMessage } from '@/utils/messageActions';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';

interface SetReminderActionProps {
  isOpen: boolean;
  onClose: () => void;
  onSetReminder: (message: string) => void;
}

const SetReminderAction: React.FC<SetReminderActionProps> = ({
  isOpen,
  onClose,
  onSetReminder
}) => {
  const [reminderText, setReminderText] = useState('');
  const [reminderDate, setReminderDate] = useState<Date>(addDays(new Date(), 1));

  const handleSetReminder = () => {
    if (!reminderText.trim()) {
      toast.error("Please enter a reminder text");
      return;
    }

    const reminderInfo: ReminderInfo = {
      text: reminderText,
      date: reminderDate,
      isCompleted: false
    };

    if (saveReminder(reminderInfo)) {
      const message = formatReminderMessage(reminderInfo);
      onSetReminder(message);
      onClose();
      
      toast.success("Reminder set!", {
        description: `You'll be reminded about "${reminderText}" on ${format(reminderDate, 'MMM d')}`
      });
    } else {
      toast.error("Failed to set reminder", {
        description: "There was an error saving your reminder. Please try again."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set a Reminder</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="reminderText">What to remember?</Label>
            <Input
              id="reminderText"
              placeholder="Call match, Send flowers, etc."
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label>When?</Label>
            <Calendar
              mode="single"
              selected={reminderDate}
              onSelect={(date) => date && setReminderDate(date)}
              className="rounded border pointer-events-auto"
              disabled={(date) => date < new Date()}
            />
          </div>

          <div className="bg-love-50 p-3 rounded-md flex items-start gap-3 mt-2">
            <Clock className="text-love-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-muted-foreground">
              Set a reminder for important events with your match. You'll be notified when it's time!
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSetReminder} 
            disabled={!reminderText.trim()}
          >
            Set Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetReminderAction;
