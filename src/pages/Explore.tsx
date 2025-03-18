import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from '@/context/UserContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Heart, MessageSquare, Share, Search, Book, User, Plus, Gift, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import GiftSelector from '@/components/GiftSelector';

const Explore: React.FC = () => {
  const { isAuthenticated } = useProtectedRoute();
  const { currentUser, getFilteredPosts, getAllPosts, likeBlogPost, commentOnBlogPost, createBlogPost } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('foryou');
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const navigate = useNavigate();
  
  // Add loading state to handle initial render
  useEffect(() => {
    if (isAuthenticated) {
      // Set a small timeout to allow context to fully initialize
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return null; // Protected route hook will handle redirect
  }
  
  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-love-500 mb-4" />
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const allPosts = getAllPosts() || [];
  const filteredPosts = getFilteredPosts() || [];
  
  const displayPosts = activeTab === 'foryou' ? filteredPosts : allPosts;
  
  const searchedPosts = searchQuery.trim() 
    ? displayPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : displayPosts;
  
  const handleLikePost = (postId: string, userId: string) => {
    try {
      likeBlogPost(postId, userId);
      toast.success("Post liked successfully");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };
  
  const handleViewProfile = (userId: string) => {
    if (userId === currentUser.id) {
      navigate('/profile');
    } else {
      navigate(`/profiles/${userId}`);
    }
  };
  
  const handleViewPost = (postId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    navigate(`/blog/${postId}`);
  };
  
  const handleOpenGiftSelector = (postId: string) => {
    setSelectedPostId(postId);
    setShowGiftSelector(true);
  };
  
  const handleSendGift = (giftType: 'rose' | 'heart' | 'teddy') => {
    if (selectedPostId) {
      commentOnBlogPost(selectedPostId, `I sent you a ${giftType}! 💝`);
      toast.success(`You sent a ${giftType}!`);
    }
    setShowGiftSelector(false);
    setSelectedPostId(null);
  };
  
  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      try {
        createBlogPost(newPostTitle.trim(), newPostContent.trim(), newPostTags);
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostTags([]);
        setShowNewPostDialog(false);
        toast.success("Post created successfully");
      } catch (error) {
        console.error("Error creating post:", error);
        toast.error("Failed to create post");
      }
    } else {
      toast.error("Title and content are required");
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !newPostTags.includes(tagInput.trim())) {
      setNewPostTags([...newPostTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (index: number) => {
    const updatedTags = [...newPostTags];
    updatedTags.splice(index, 1);
    setNewPostTags(updatedTags);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 pb-36">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              <Book />
              <span>Explore</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover stories, experiences, and insights from the community
            </p>
          </div>
          
          <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-love hover:opacity-90 gap-2">
                <Plus size={16} />
                <span>New Post</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your post"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, experiences, or stories..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="min-h-[200px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag (e.g., Dating, Travel, Advice)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  {newPostTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newPostTags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="flex items-center gap-1 bg-love-50 text-love-700 hover:bg-love-100"
                        >
                          {tag}
                          <button 
                            type="button" 
                            className="ml-1 text-love-500 hover:text-love-700"
                            onClick={() => handleRemoveTag(index)}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-love hover:opacity-90" onClick={handleCreatePost}>
                    Publish Post
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
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
                    <Button 
                      onClick={() => setShowNewPostDialog(true)}
                      className="bg-gradient-love hover:opacity-90 mt-2"
                    >
                      <Plus size={16} className="mr-2" />
                      Create First Post
                    </Button>
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
                      <Card 
                        key={post.id}
                        className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                        onClick={(e) => handleViewPost(post.id, e)}
                      >
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 h-auto flex items-center gap-1 text-muted-foreground text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewProfile(post.userId);
                                }}
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
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="bg-love-50 text-love-700"
                                onClick={(e) => e.stopPropagation()}
                              >
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikePost(post.id, post.userId);
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPost(post.id, e);
                                }}
                              >
                                <MessageSquare size={16} />
                                <span>{post.comments.length}</span>
                              </Button>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 px-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenGiftSelector(post.id);
                                }}
                              >
                                <Gift size={16} />
                                <span>Gift</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 px-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Share size={16} />
                                <span>Share</span>
                              </Button>
                            </div>
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
                    <Button 
                      onClick={() => setShowNewPostDialog(true)}
                      className="bg-gradient-love hover:opacity-90 mt-2"
                    >
                      <Plus size={16} className="mr-2" />
                      Create First Post
                    </Button>
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
                      <Card 
                        key={post.id}
                        className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                        onClick={(e) => handleViewPost(post.id, e)}
                      >
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 h-auto flex items-center gap-1 text-muted-foreground text-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewProfile(post.userId);
                                }}
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
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="bg-love-50 text-love-700"
                                onClick={(e) => e.stopPropagation()}
                              >
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikePost(post.id, post.userId);
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPost(post.id, e);
                                }}
                              >
                                <MessageSquare size={16} />
                                <span>{post.comments.length}</span>
                              </Button>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 px-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenGiftSelector(post.id);
                                }}
                              >
                                <Gift size={16} />
                                <span>Gift</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 px-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Share size={16} />
                                <span>Share</span>
                              </Button>
                            </div>
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
      
      <GiftSelector 
        isOpen={showGiftSelector} 
        onClose={() => setShowGiftSelector(false)}
        onSendGift={handleSendGift}
      />
      
      <Footer />
    </div>
  );
};

export default Explore;
