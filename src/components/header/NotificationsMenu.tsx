
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NotificationsMenu = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell size={20} />
          <Badge className="bg-love-500 absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">3</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2 dark:bg-slate-900 dark:border-slate-800">
        <div className="text-sm font-semibold py-2 px-4 border-b dark:border-slate-700">Notifications</div>
        <div className="py-2">
          <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-md">
            <p className="text-sm font-medium">You have a new match!</p>
            <p className="text-xs text-muted-foreground">2 minutes ago</p>
          </div>
          <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-md">
            <p className="text-sm font-medium">John sent you a message</p>
            <p className="text-xs text-muted-foreground">1 hour ago</p>
          </div>
          <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-md">
            <p className="text-sm font-medium">Your profile has been viewed 10 times</p>
            <p className="text-xs text-muted-foreground">3 hours ago</p>
          </div>
        </div>
        <div className="border-t pt-2 pb-1 px-4 dark:border-slate-700">
          <Button variant="link" className="w-full justify-center text-xs h-8">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsMenu;
