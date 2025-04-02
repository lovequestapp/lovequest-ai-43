import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, X, Zap, MapPin, MessageCircle } from "lucide-react";
import { UserWithCoordinates } from '@/types/user';
import { useNavigate } from 'react-router-dom';

export interface ProfileCardProps {
  profile: UserWithCoordinates;
  onBoost?: () => void;  // Make this prop optional
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onBoost }) => {
  const navigate = useNavigate();
  
  const handleLike = () => {
    console.log('Liked profile:', profile.id);
  };
  
  const handlePass = () => {
    console.log('Passed profile:', profile.id);
  };
  
  const handleBoost = () => {
    if (onBoost) {
      onBoost();
    } else {
      console.log('Boost profile:', profile.id);
    }
  };
  
  const handleMessage = () => {
    navigate(`/messages/${profile.id}`);
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <div className="aspect-[4/5] overflow-hidden bg-muted">
          <img 
            src={profile.photos?.[0] || 'https://via.placeholder.com/300x400?text=No+Photo'} 
            alt={profile.name} 
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="absolute top-3 right-3 flex gap-1">
          {profile.verificationStatus === 'verified' && (
            <Badge variant="secondary" className="bg-blue-500 text-white">
              Verified
            </Badge>
          )}
          {profile.premiumStatus === 'vip' && (
            <Badge variant="secondary" className="bg-amber-500 text-white">
              VIP
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{profile.name}, {profile.age}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={14} className="mr-1" />
              <span>{profile.location}</span>
            </div>
          </div>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.photos?.[0]} />
            <AvatarFallback>{profile.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        
        <p className="text-sm line-clamp-2 mb-3">{profile.bio}</p>
        
        <div className="flex flex-wrap gap-1">
          {profile.interests?.slice(0, 3).map((interest, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
          {profile.interests && profile.interests.length > 3 && (
            <Badge variant="outline" className="text-xs">+{profile.interests.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-2 bg-muted/20 flex justify-between">
        <Button variant="ghost" size="icon" onClick={handlePass} className="rounded-full">
          <X className="h-5 w-5 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleBoost} className="rounded-full">
          <Zap className="h-5 w-5 text-amber-500" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleMessage} className="rounded-full">
          <MessageCircle className="h-5 w-5 text-blue-500" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLike} className="rounded-full">
          <Heart className="h-5 w-5 text-rose-500" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
