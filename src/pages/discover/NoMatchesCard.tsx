
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const NoMatchesCard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleUpdatePreferences = () => {
    // Navigate to the user profile edit screen with preferences tab selected
    navigate('/user-profile?tab=edit&section=preferences');
    
    toast({
      title: "Opening preferences",
      description: "You can update your matching preferences here",
    });
  };
  
  return (
    <Card className="max-w-md mx-auto text-center p-8 border-love-100 shadow-md">
      <CardContent className="p-6 flex flex-col items-center">
        <Badge className="mb-4 bg-love-100 text-love-700 border-0 py-1.5 px-3">
          <Sparkles size={14} className="mr-1.5" />
          AI Matching
        </Badge>
        
        <h2 className="text-2xl font-display font-semibold mb-3">No more matches for now</h2>
        
        <p className="text-muted-foreground mb-6">
          We're working on finding your perfect matches. Update your preferences to see more potential connections!
        </p>
        
        <Button 
          className="bg-gradient-to-r from-love-500 to-love-600 hover:opacity-90"
          onClick={handleUpdatePreferences}
        >
          Update Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoMatchesCard;
