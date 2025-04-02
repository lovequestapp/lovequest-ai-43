import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/context/UserContext';
import { BlogPostType, User } from '@/types/user';
import { calculateCompatibilityScore } from '@/utils/matchingAlgorithm';
import { 
  Users, Search, Heart, MessageSquare, Compass, 
  BookMarked, Star, Zap, PenSquare, Flame,
  UserPlus, Gift, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const Explore = () => {
  const { currentUser, getAllPosts, getFilteredPosts, likeUser, boostProfile, sendGift } = useUser();
  const [activeTab, setActiveTab] = useState('trending');
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  
  if (!currentUser) return null;
  
  const allPosts = getAllPosts();
  const personalizedPosts = getFilteredPosts();
  
  // Sort trending posts by engagement (likes + comments)
  const trendingPosts = [...allPosts]
    .sort((a, b) => {
      const aEngagement = a.likes + a.comments.length;
      const bEngagement = b.likes + b.comments.length;
      return bEngagement - aEngagement;
    })
    .slice(0, 8);
  
  // Get recent posts (newest first)
  const recentPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  
  // Filter by search query if provided
  const filteredPosts = searchText
    ? allPosts.filter(post => 
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.content.toLowerCase().includes(searchText.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      )
    : [];
  
  // Simulated potential matches based on content engagement
  const potentialMatches = allPosts
    .filter(post => post.userId !== currentUser.id)
    .map(post => {
      // Get unique users who interact with the same content
      const userIds = post.comments
        .map(comment => comment.userId)
        .filter(id => id !== currentUser.id);
      
      return userIds;
    })
    .flat()
    .filter((id, index, self) => self.indexOf(id) === index)
    .slice(0, 6)
    .map(id => ({
      id,
      name: `User ${id.slice(0, 4)}`,
      age: Math.floor(Math.random() * 20) + 20,
      location: "Nearby",
      photo: `https://i.pravatar.cc/150?u=${id}`,
      compatibilityScore: Math.floor(Math.random() * 30) + 70
    }));
  
  const handleLikeUser = (userId: string) => {
    likeUser(userId);
    toast.success("You liked this profile!");
  };
  
  const handleSendGift = (userId: string) => {
    sendGift(userId, "rose");
    toast.success("Gift sent successfully!");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-love text-transparent bg-clip-text">
            Explore & Discover
          </h1>
          <p className="text-muted-foreground">Find content and people that match your interests</p>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10 bg-background"
            placeholder="Search for posts, topics, or interests..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value as string)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-4">
            <TabsTrigger value="trending">
              <Flame className="mr-2 h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="foryou">
              <Sparkles className="mr-2 h-4 w-4" />
              For You
            </TabsTrigger>
            <TabsTrigger value="discover">
              <Compass className="mr-2 h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="matches">
              <Heart className="mr-2 h-4 w-4" />
              Matches
            </TabsTrigger>
          </TabsList>
          
          {/* Search Results */}
          {searchText && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPosts.map(post => (
                    <Card 
                      key={post.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                        <p className="line-clamp-2 text-sm mb-2">{post.content}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{post.likes} likes</span>
                          <span className="mx-1">•</span>
                          <span>{post.comments.length} comments</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results found for "{searchText}"</p>
                </div>
              )}
            </div>
          )}
          
          <TabsContent value="trending" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingPosts.map(post => (
                <Card 
                  key={post.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold line-clamp-1">{post.title}</h3>
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                        <Flame className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm mb-3">{post.content}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Heart className="h-3 w-3 mr-1" />
                      <span>{post.likes}</span>
                      <span className="mx-1">•</span>
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{post.comments.length}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/blog')}
              >
                View All Posts
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="foryou" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalizedPosts.length > 0 ? (
                personalizedPosts.map(post => (
                  <Card 
                    key={post.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold line-clamp-1">{post.title}</h3>
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          <Zap className="h-3 w-3 mr-1" />
                          For You
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-sm mb-3">{post.content}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Heart className="h-3 w-3 mr-1" />
                        <span>{post.likes}</span>
                        <span className="mx-1">•</span>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{post.comments.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">
                    We're still learning your preferences. Explore more content to see personalized recommendations!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="discover" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentPosts.slice(0, 5).map(post => (
                      <div 
                        key={post.id}
                        className="p-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                          <PenSquare className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4"
                    onClick={() => navigate('/blog')}
                  >
                    See All
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(allPosts.flatMap(post => post.tags))
                    ).slice(0, 12).map((tag, i) => (
                      <Badge 
                        key={i}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => {
                          setSearchText(tag);
                          setActiveTab('trending');
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Create New Content</h4>
                    <Button 
                      className="w-full"
                      onClick={() => navigate('/blog')}
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      Write a Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="matches" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Suggested Matches Based on Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These users engage with similar content as you
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {potentialMatches.map(match => (
                  <Card key={match.id} className="overflow-hidden">
                    <div className="aspect-[3/4] relative">
                      <img 
                        src={match.photo} 
                        alt={match.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h4 className="text-white font-medium">{match.name}, {match.age}</h4>
                        <p className="text-white/80 text-sm">{match.location}</p>
                      </div>
                      
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1.5">
                        <div className="text-xs font-semibold flex items-center gap-0.5">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span>{match.compatibilityScore}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleLikeUser(match.id)}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleSendGift(match.id)}
                        >
                          <Gift className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/profile/${match.id}`)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  onClick={() => navigate('/discover')}
                >
                  Discover More Matches
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
