
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/context/UserContext';
import { Heart, MessageSquare, Share, Search, Book, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Explore: React.FC = () => {
  const { currentUser, getFilteredPosts, getAllPosts, likeBlogPost, commentOnBlogPost } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('foryou');
  const navigate = useNavigate();
  
  if (!currentUser) return null;
  
  const allPosts = getAllPosts();
  const filteredPosts = getFilteredPosts();
  
  const displayPosts = activeTab === 'foryou' ? filteredPosts : allPosts;
  
  const searchedPosts = searchQuery.trim() 
    ? displayPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : displayPosts;
  
  const handleLikePost = (postId: string, userId: string) => {
    likeBlogPost(postId, userId);
  };
  
  const handleViewProfile = (userId: string) => {
    // For now just show an alert since we can't navigate to other user profiles directly
    if (userId === currentUser.id) {
      navigate('/profile');
    } else {
      alert(`Viewing ${userId}'s profile`);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 pb-36">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <Book />
            <span>Explore</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover stories, experiences, and insights from the community
          </p>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts, topics, or tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="foryou" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="foryou">For You</TabsTrigger>
            <TabsTrigger value="all">All Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="foryou">
            <div className="mt-4">
              {searchedPosts.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Book size={48} className="text-muted-foreground" />
                    <h3 className="text-xl font-medium">No Posts Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery.trim() 
                        ? "No posts match your search criteria. Try different keywords."
                        : "There are no posts from users matching your preferences yet."}
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchedPosts.map(post => {
                    const isCurrentUser = post.userId === currentUser.id;
                    const author = isCurrentUser 
                      ? currentUser.name 
                      : post.comments[0]?.userName || 'Unknown';
                    
                    return (
                      <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 h-auto flex items-center gap-1 text-muted-foreground text-sm"
                                onClick={() => handleViewProfile(post.userId)}
                              >
                                <User size={14} />
                                <span>{author}</span>
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className="line-clamp-3 text-sm mb-4 flex-grow">{post.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-love-50 text-love-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-between mt-auto">
                            <div className="flex gap-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 px-1.5"
                                onClick={() => handleLikePost(post.id, post.userId)}
                              >
                                <Heart 
                                  size={16} 
                                  className={post.likes > 0 ? "text-love-500 fill-love-500" : ""} 
                                />
                                <span>{post.likes}</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 px-1.5"
                              >
                                <MessageSquare size={16} />
                                <span>{post.comments.length}</span>
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1 px-1.5"
                            >
                              <Share size={16} />
                              <span>Share</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="mt-4">
              {searchedPosts.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Book size={48} className="text-muted-foreground" />
                    <h3 className="text-xl font-medium">No Posts Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery.trim() 
                        ? "No posts match your search criteria. Try different keywords."
                        : "There are no posts from any users yet."}
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchedPosts.map(post => {
                    const isCurrentUser = post.userId === currentUser.id;
                    const author = isCurrentUser 
                      ? currentUser.name 
                      : post.comments[0]?.userName || 'Unknown';
                    
                    return (
                      <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 h-auto flex items-center gap-1 text-muted-foreground text-sm"
                                onClick={() => handleViewProfile(post.userId)}
                              >
                                <User size={14} />
                                <span>{author}</span>
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className="line-clamp-3 text-sm mb-4 flex-grow">{post.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-love-50 text-love-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-between mt-auto">
                            <div className="flex gap-4">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 px-1.5"
                                onClick={() => handleLikePost(post.id, post.userId)}
                              >
                                <Heart 
                                  size={16} 
                                  className={post.likes > 0 ? "text-love-500 fill-love-500" : ""} 
                                />
                                <span>{post.likes}</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 px-1.5"
                              >
                                <MessageSquare size={16} />
                                <span>{post.comments.length}</span>
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1 px-1.5"
                            >
                              <Share size={16} />
                              <span>Share</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
