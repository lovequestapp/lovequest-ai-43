
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Eye, Shield, Rocket, X } from 'lucide-react';
import { User } from '@/types/user';
import { useNavigate } from 'react-router-dom';

export interface ProfileCardProps {
  profile: User;
  currentUser?: User | null;
  showActions?: boolean;
  isMatch?: boolean;
  alreadyLiked?: boolean;
  onLike?: (profileId: string) => void;
  onPass?: (profileId: string) => void;
  onBoost?: (profileId: string) => void;
  onUnmatch?: (profileId: string) => void;
  onViewProfile?: () => void; // Added this prop for viewing profile on click
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  currentUser, 
  showActions = false,
  isMatch = false,
  alreadyLiked = false,
  onLike,
  onPass,
  onBoost,
  onUnmatch,
  onViewProfile,
}) => {
  const navigate = useNavigate();
  
  const handleProfileClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on action buttons
    if ((e.target as HTMLElement).closest('.card-action-button')) {
      return;
    }

    if (onViewProfile) {
      onViewProfile();
    } else if (profile.id) {
      navigate(`/profile/${profile.id}`);
    }
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) onLike(profile.id);
  };
  
  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPass) onPass(profile.id);
  };
  
  const handleBoost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBoost) onBoost(profile.id);
  };
  
  const handleUnmatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUnmatch) onUnmatch(profile.id);
  };
  
  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={handleProfileClick}>
      <div className="aspect-[3/4] relative">
        <img 
          src={profile.photos?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-medium text-lg">
            {profile.name}, {profile.age}
          </h3>
          <p className="text-white/80 text-sm flex items-center gap-1">
            <span>{profile.location || 'Unknown location'}</span>
          </p>
        </div>
        
        {profile.verificationStatus === 'verified' && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-100 text-blue-700 border-none flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Verified</span>
            </Badge>
          </div>
        )}
        
        {isMatch && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-love-100 text-love-700 border-none flex items-center gap-1">
              <span>Match!</span>
            </Badge>
          </div>
        )}
      </div>
      
      {showActions && (
        <CardContent className="p-3">
          <div className="flex gap-2">
            {!isMatch && onLike && (
              <Button 
                className={`flex-1 ${alreadyLiked ? 'bg-love-100 text-love-700' : ''}`}
                variant={alreadyLiked ? 'outline' : 'default'}
                size="sm"
                onClick={handleLike}
                disabled={alreadyLiked}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/messages/${profile.id}`);
              }}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            
            {!isMatch && onBoost && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleBoost}
              >
                <Rocket className="h-4 w-4" />
              </Button>
            )}
            
            {isMatch && onUnmatch ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-red-500 hover:text-red-700"
                onClick={handleUnmatch}
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              !isMatch && onPass && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handlePass}
                >
                  <X className="h-4 w-4" />
                </Button>
              )
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ProfileCard;
