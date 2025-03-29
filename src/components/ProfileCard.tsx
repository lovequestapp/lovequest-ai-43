
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from '@/types/user';
import { Heart, X, MessageCircle, MapPin, Shield, Sparkles } from 'lucide-react';

interface ProfileCardProps {
  profile: User;
  showActions?: boolean;
  onLike?: () => void;
  onPass?: () => void;
  currentUser?: User | null;
  isMatch?: boolean;
  alreadyLiked?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  showActions = false,
  onLike,
  onPass,
  currentUser,
  isMatch = false,
  alreadyLiked = false
}) => {
  const navigate = useNavigate();
  
  // Calculate compatibility score
  const compatibilityScore = currentUser ? profile.compatibilityScore : Math.floor(Math.random() * 50) + 50;
  
  // Determine color based on compatibility level
  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-emerald-100 text-emerald-800';
    if (score >= 60) return 'bg-lime-100 text-lime-800';
    if (score >= 50) return 'bg-amber-100 text-amber-800';
    return 'bg-orange-100 text-orange-800';
  };
  
  const profileImage = profile.photos && profile.photos.length > 0 
    ? profile.photos[0] 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`;
  
  const handleViewProfile = () => {
    navigate(`/profile/${profile.id}`);
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow relative">
      {isMatch && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-love-500 to-purple-500 text-white flex items-center gap-1 shadow-md">
            <Sparkles size={14} />
            <span>Match!</span>
          </Badge>
        </div>
      )}
      
      {/* Message button for matches */}
      {isMatch && (
        <Button 
          size="sm" 
          className="absolute top-2 left-2 z-10 bg-white text-love-600 hover:bg-love-50"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/messages/${profile.id}`);
          }}
        >
          <MessageCircle size={16} />
        </Button>
      )}
      
      <div 
        className="aspect-[3/4] w-full bg-muted cursor-pointer"
        onClick={handleViewProfile}
      >
        <img 
          src={profileImage} 
          alt={`${profile.name}'s profile`}
          className="w-full h-full object-cover"
        />
        
        {/* Compatibility badge */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-medium text-white truncate">{profile.name}, {profile.age}</h3>
              <div className="flex items-center text-white/80 text-sm">
                <MapPin size={14} className="mr-1" />
                <span className="truncate">{profile.location}</span>
              </div>
            </div>
            
            <Badge className={`${getCompatibilityColor(compatibilityScore)} font-medium`}>
              {compatibilityScore}% Match
            </Badge>
          </div>
        </div>
        
        {/* Verification badge if verified */}
        {profile.verificationStatus === 'verified' && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
              <Shield size={12} />
              <span>Verified</span>
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="space-y-2">
          <p className="text-sm line-clamp-2">{profile.bio}</p>
          
          <div className="flex flex-wrap gap-1">
            {profile.interests.slice(0, 4).map((interest, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
            {profile.interests.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{profile.interests.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-center gap-2 p-3 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPass?.();
            }}
            className="rounded-full h-10 w-10 p-0"
          >
            <X size={20} className="text-gray-500" />
          </Button>
          
          <Button
            onClick={handleViewProfile}
            variant="outline"
            size="sm"
            className="text-xs px-3"
          >
            View Profile
          </Button>
          
          <Button
            variant={alreadyLiked ? "outline" : "default"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLike?.();
            }}
            className={`rounded-full h-10 w-10 p-0 ${
              alreadyLiked 
                ? 'bg-love-50 text-love-500 border-love-200' 
                : 'bg-love-500 hover:bg-love-600'
            }`}
          >
            <Heart 
              size={20} 
              className={alreadyLiked ? "fill-love-500" : "text-white"} 
            />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileCard;
