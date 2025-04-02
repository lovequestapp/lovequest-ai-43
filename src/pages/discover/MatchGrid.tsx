
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedMark } from "@/components/VerifiedMark";
import { UserWithCoordinates } from '@/types/user';
import { Heart, MessageSquare, Eye } from "lucide-react";

interface MatchGridProps {
  user: UserWithCoordinates;
  onViewProfile: () => void;
  onLike: () => void;
  isDemo?: boolean;
}

const MatchGrid: React.FC<MatchGridProps> = ({ user, onViewProfile, onLike, isDemo }) => {

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
      // Default or 'none'
      return null;
    }
    
    return (
      <div className={`absolute top-2 right-2 ${badgeClass} text-white text-xs font-semibold px-2 py-1 rounded-full z-10`}>
        {badgeText}
      </div>
    );
  };

  return (
    <Card className="relative">
      {renderBoostBadge(user)}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {user.name}
            {user.verificationStatus === 'verified' && <VerifiedMark status="verified" showTooltip={true} size="sm" />}
          </CardTitle>
        </div>
        <CardDescription>{user.bio.substring(0, 80)}...</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <Avatar className="w-32 h-32">
          <AvatarImage src={user.photos && user.photos.length > 0 ? user.photos[0] : undefined} alt={`Profile picture of ${user.name}`} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">{user.location}</p>
        </div>
      </CardContent>
      <div className="flex justify-between items-center p-4">
        <Button variant="outline" onClick={onViewProfile} disabled={isDemo}>
          <Eye className="w-4 h-4 mr-2" />
          View Profile
        </Button>
        <Button onClick={onLike} disabled={isDemo}>
          <Heart className="w-4 h-4 mr-2" />
          Like
        </Button>
      </div>
    </Card>
  );
};

export default MatchGrid;
