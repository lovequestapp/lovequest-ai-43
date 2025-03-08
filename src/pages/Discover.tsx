
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import { useUser } from '@/context/UserContext';
import { getAiEnhancedMatches, shouldBoostProfile } from '@/utils/matchingAlgorithm';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Filter, Flame, Crown } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const Discover = () => {
  const { currentUser, potentialMatches, likeUser, passUser } = useUser();
  const [enhancedMatches, setEnhancedMatches] = useState<any[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  
  useEffect(() => {
    if (currentUser && potentialMatches.length > 0) {
      // Use our enhanced algorithm to sort matches
      const sortedMatches = getAiEnhancedMatches(currentUser, potentialMatches);
      
      // Apply visual indicators for boosted profiles
      const matchesWithBoostInfo = sortedMatches.map(match => {
        const popularityScore = match.popularityPoints || 0;
        const isBoosted = shouldBoostProfile(popularityScore);
        
        return {
          ...match,
          isBoosted,
          boostLevel: isBoosted 
            ? (popularityScore >= 100 ? 'super' : 'standard')
            : undefined
        };
      });
      
      setEnhancedMatches(matchesWithBoostInfo);
      
      // Notify user about boosted profiles (only on initial load)
      const boostedCount = matchesWithBoostInfo.filter(m => m.isBoosted).length;
      if (boostedCount > 0) {
        toast({
          title: `${boostedCount} Boosted ${boostedCount === 1 ? 'Profile' : 'Profiles'}`,
          description: "Popular profiles are highlighted and ranked higher",
        });
      }
    }
  }, [currentUser, potentialMatches]);
  
  const togglePopularFilter = () => {
    setIsFiltering(!isFiltering);
    
    // If turning on filter, only show boosted profiles
    // If turning off, show all profiles again
    if (!isFiltering) {
      toast({
        title: "Showing Popular Profiles",
        description: "Displaying profiles that are trending right now",
      });
    } else {
      toast({
        title: "Showing All Profiles",
        description: "Displaying all compatible matches",
      });
    }
  };
  
  // Filter matches based on selected filters
  const displayedMatches = isFiltering
    ? enhancedMatches.filter(match => match.isBoosted)
    : enhancedMatches;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Added significant bottom padding (pb-36) to ensure content doesn't get hidden by footer */}
      <main className="flex-grow container mx-auto px-4 py-8 pb-36">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Discover</h1>
            <p className="text-muted-foreground">Find your perfect match based on compatibility</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={isFiltering ? "default" : "outline"} 
              onClick={togglePopularFilter}
              className="flex items-center gap-2"
            >
              <Flame size={16} className={isFiltering ? "text-white" : ""} />
              <span>Popular</span>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filters</span>
            </Button>
          </div>
        </div>
        
        {displayedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMatches.map(match => (
              <div key={match.id} className="relative">
                {match.isBoosted && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className={`py-1 px-3 flex items-center gap-1 ${
                      match.boostLevel === 'super' 
                        ? 'bg-amber-500 text-amber-950 border-amber-600' 
                        : 'bg-gradient-love text-white'
                    }`}>
                      {match.boostLevel === 'super' ? (
                        <Crown size={14} className="mr-1" />
                      ) : (
                        <Sparkles size={14} className="mr-1" />
                      )}
                      {match.boostLevel === 'super' ? 'Super Popular' : 'Popular'}
                    </Badge>
                  </div>
                )}
                <ProfileCard
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
              </div>
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
