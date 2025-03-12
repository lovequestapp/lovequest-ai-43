
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  interests: string[];
  photos: string[];
  compatibilityScore?: number;
  personalityTraits?: string[];
  onLike?: (id: string) => void;
  onPass?: (id: string) => void;
  onMessage?: (id: string) => void;
  detailed?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  age,
  bio,
  location,
  interests,
  photos,
  compatibilityScore,
  personalityTraits,
  onLike,
  onPass,
  onMessage,
  detailed = false,
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      detailed ? "max-w-2xl mx-auto" : "max-w-sm w-full card-hover"
    )}>
      <div className="relative">
        <img 
          src={photos[0]} 
          alt={`${name}'s profile`} 
          className={cn(
            "w-full object-cover", 
            detailed ? "h-96" : "h-72"
          )}
        />
        
        {compatibilityScore && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 px-3 rounded-full flex items-center gap-1.5 shadow-md">
            <Sparkles size={16} className="text-love-500" />
            <span className="font-semibold text-love-700">{compatibilityScore}% Match</span>
          </div>
        )}
      </div>
      
      <CardContent className={cn(
        "p-5", 
        detailed ? "space-y-6" : "space-y-4"
      )}>
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-display font-bold">{name}, {age}</h3>
            
            {detailed && compatibilityScore && (
              <Badge variant="outline" className="bg-love-50 text-love-700 border-love-200 px-3 py-1">
                <Sparkles size={14} className="mr-1 text-love-500" />
                {compatibilityScore}% Match
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin size={16} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
        
        <p className={cn(
          "text-gray-700",
          detailed ? "" : "line-clamp-3"
        )}>
          {bio}
        </p>
        
        {personalityTraits && personalityTraits.length > 0 && detailed && (
          <div className="flex flex-wrap gap-2">
            {personalityTraits.map((trait, index) => (
              <Badge key={`trait-${index}`} className="bg-love-500">
                {trait}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <Badge key={`interest-${index}`} variant="secondary" className="bg-love-50 text-love-700 hover:bg-love-100">
              {interest}
            </Badge>
          ))}
        </div>
        
        {!detailed && (onLike || onPass) && (
          <div className="flex justify-between items-center pt-2">
            {onPass && (
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 border-gray-300"
                onClick={() => onPass(id)}
              >
                <X size={24} className="text-gray-500" />
              </Button>
            )}
            
            {onLike && (
              <Button 
                className="rounded-full h-12 w-12 bg-gradient-love hover:opacity-90"
                size="icon"
                onClick={() => onLike(id)}
              >
                <Heart size={24} className="text-white" />
              </Button>
            )}
          </div>
        )}
        
        {detailed && onMessage && (
          <Button 
            className="w-full bg-gradient-love hover:opacity-90"
            onClick={() => onMessage(id)}
          >
            <MessageCircle size={18} className="mr-2" />
            Send Message
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
