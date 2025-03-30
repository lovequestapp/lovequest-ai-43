
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';

export type QuickActionType = 'schedule' | 'location' | 'photo' | 'reminder';

export interface ScheduleInfo {
  date: Date;
  time: string;
  activity: string;
  location?: string;
}

export interface LocationInfo {
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ReminderInfo {
  text: string;
  date: Date;
  isCompleted: boolean;
}

export const getDefaultScheduleDate = (): Date => {
  // Default to 3 days from now at 7 PM
  return addDays(new Date(), 3);
};

export const formatScheduleMessage = (scheduleInfo: ScheduleInfo): string => {
  const dateStr = format(scheduleInfo.date, 'EEEE, MMMM d');
  return `Let's meet on ${dateStr} at ${scheduleInfo.time} for ${scheduleInfo.activity}${
    scheduleInfo.location ? ` at ${scheduleInfo.location}` : ''
  }. Does that work for you?`;
};

export const formatLocationMessage = (locationInfo: LocationInfo): string => {
  return `I'm at ${locationInfo.name}. The address is: ${locationInfo.address}. Would you like to meet here?`;
};

export const formatReminderMessage = (reminderInfo: ReminderInfo): string => {
  const dateStr = format(reminderInfo.date, 'EEEE, MMMM d');
  return `I've set a reminder for "${reminderInfo.text}" on ${dateStr}. I'll remind you about this!`;
};

export const getCurrentLocation = async (): Promise<LocationInfo | null> => {
  // This would normally use the Geolocation API, but we'll simulate it
  try {
    // Simulate getting location
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      name: "Coffee Shop Downtown",
      address: "123 Main St, Downtown",
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    };
  } catch (error) {
    console.error("Error getting location:", error);
    toast.error("Could not get your location");
    return null;
  }
};

export const saveReminder = (reminderInfo: ReminderInfo): boolean => {
  try {
    // In a real app, this would save to a database or local storage
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.push({
      ...reminderInfo,
      id: `reminder-${Date.now()}`
    });
    localStorage.setItem('reminders', JSON.stringify(reminders));
    return true;
  } catch (error) {
    console.error("Error saving reminder:", error);
    return false;
  }
};

export const getUpcomingReminders = (): ReminderInfo[] => {
  try {
    // Get reminders from local storage
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    return reminders.filter((r: ReminderInfo & { id: string }) => !r.isCompleted);
  } catch (error) {
    console.error("Error getting reminders:", error);
    return [];
  }
};
