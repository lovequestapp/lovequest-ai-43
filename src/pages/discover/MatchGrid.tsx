import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles,
  MapPin,
  Globe,
  Crown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserWithCoordinates } from '@/types/user';

interface MatchGridProps {
  matches: UserWithCoordinates[];
  onViewProfile: (userId: string) => void;
}

const MatchGrid: React.FC<MatchGridProps> = ({ matches, onViewProfile }) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map(match => (
        <Card 
          key={match.id} 
          className="overflow-hidden hover:shadow-md transition-shadow"
          onClick={() => onViewProfile(match.id)}
        >
          <div className="aspect-[3/4] relative">
            <img 
              src={match.photos[0]} 
              alt={match.name} 
              className="w-full h-full object-cover"
            />
            
            {match.isBoosted && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className={`py-1 px-3 flex items-center gap-1 ${
                  match.boostLevel === 'super' 
                    ? 'bg-amber-500 text-amber-950 border-amber-600' 
                    : match.boostLevel === 'international'
                      ? 'bg-purple-500 text-white'
                      : match.boostLevel === 'local'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gradient-love text-white'
                }`}>
                  {match.boostLevel === 'super' ? (
                    <Crown size={14} className="mr-1" />
                  ) : match.boostLevel === 'international' ? (
                    <Globe size={14} className="mr-1" />
                  ) : match.boostLevel === 'local' ? (
                    <MapPin size={14} className="mr-1" />
                  ) : (
                    <Sparkles size={14} className="mr-1" />
                  )}
                </Badge>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-xl font-semibold text-white">
                {match.name}, {match.age}
              </h3>
              
              <div className="flex items-center text-white/80">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{match.location}</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1 text-sm">
                <Sparkles size={14} className="text-love-500" />
                <span className="font-medium">Match: {match.compatibilityScore}%</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full h-8 px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/messages/${match.id}`);
                }}
              >
                Message
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {match.interests.slice(0, 3).map((interest: string, idx: number) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="bg-love-50 text-love-700"
                >
                  {interest}
                </Badge>
              ))}
              {match.interests.length > 3 && (
                <Badge variant="outline">
                  +{match.interests.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatchGrid;
