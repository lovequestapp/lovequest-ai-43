
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import { useUser } from '@/context/UserContext';
import { getAiEnhancedMatches } from '@/utils/matchingAlgorithm';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Filter } from 'lucide-react';

const Discover = () => {
  const { currentUser, potentialMatches, likeUser, passUser } = useUser();
  
  // In a real app, we would use getAiEnhancedMatches here
  // For now, we'll just use the potential matches from context
  const enhancedMatches = currentUser 
    ? potentialMatches 
    : [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Discover</h1>
            <p className="text-muted-foreground">Find your perfect match based on compatibility</p>
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            <span>Filters</span>
          </Button>
        </div>
        
        {enhancedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enhancedMatches.map(match => (
              <ProfileCard
                key={match.id}
                id={match.id}
                name={match.name}
                age={match.age}
                bio={match.bio}
                location={match.location}
                interests={match.interests}
                photos={match.photos}
                compatibilityScore={match.compatibilityScore}
                onLike={likeUser}
                onPass={passUser}
              />
            ))}
          </div>
        ) : (
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
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
