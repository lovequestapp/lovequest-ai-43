
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

const NoMatchesCard: React.FC = () => {
  return (
    <Card className="max-w-md mx-auto text-center p-8">
      <CardContent className="p-6 flex flex-col items-center">
        <Badge className="mb-4 bg-love-100 text-love-700 border-0 py-1.5 px-3">
          <Sparkles size={14} className="mr-1.5" />
          AI Matching
        </Badge>
        
        <h2 className="text-2xl font-display font-semibold mb-3">No more matches for now</h2>
        
        <p className="text-muted-foreground mb-6">
          We're working on finding your perfect matches. Check back soon!
        </p>
        
        <Button className="bg-gradient-love hover:opacity-90">
          Update Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoMatchesCard;
