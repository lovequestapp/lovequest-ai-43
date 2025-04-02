
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedMark } from "@/components/VerifiedMark";
import { UserWithCoordinates } from '@/types/user';
import { Heart, MessageSquare, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserCardProps {
  user: UserWithCoordinates;
  onViewProfile: () => void;
  isDemo?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onViewProfile, isDemo }) => {
  const renderBoostBadge = (user: UserWithCoordinates) => {
    if (!user.isBoosted) return null;
    
    let badgeText: string;
    let badgeClass: string;
    
    if (user.boostLevel === 'local') {
      badgeText = 'Local Boost';
      badgeClass = 'bg-blue-500';
    } else if (user.boostLevel === 'international') {
      badgeText = 'International';
      badgeClass = 'bg-purple-500';
    } else if (user.boostLevel === 'super') {
      badgeText = 'Super Boost';
      badgeClass = 'bg-gradient-to-r from-pink-500 to-orange-500';
    } else {
      return null;
    }
    
    return (
      <div className={`absolute top-2 right-2 ${badgeClass} text-white text-xs font-semibold px-2 py-1 rounded-full z-10`}>
        {badgeText}
      </div>
    );
  };

  return (
    <Card className="relative overflow-hidden">
      {renderBoostBadge(user)}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            {user.name}
            {user.verificationStatus === 'verified' && <VerifiedMark />}
          </CardTitle>
          {user.distance !== undefined && (
            <Badge variant="outline" className="text-xs font-normal">
              {user.distance.toFixed(1)} miles
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {user.bio && user.bio.substring(0, 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-hidden rounded-md mb-3 aspect-[4/5]">
          <img
            src={user.photos && user.photos.length > 0 ? user.photos[0] : '/placeholder.svg'}
            alt={`Profile of ${user.name}`}
            className="object-cover w-full h-full transition-all hover:scale-105"
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{user.location}</p>
            <p className="text-xs text-muted-foreground">{user.age} years old</p>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onViewProfile}
            disabled={isDemo}
            className="ml-auto"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
