
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import Blog from '@/components/Blog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/context/UserContext';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogPostType } from '@/types/user';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPage = () => {
  const { currentUser } = useUser();
  const { allPosts, fetchFilteredPosts, isLoadingPosts, refetchPosts } = useBlogPosts();
  const [activeTab, setActiveTab] = useState('my-posts');
  const [filteredPosts, setFilteredPosts] = useState<BlogPostType[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPostType[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<string[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const navigate = useNavigate();

  // Effect for fetching initially
  useEffect(() => {
    const loadData = async () => {
      try {
        await refetchPosts();
        const posts = await fetchFilteredPosts('');
        setFilteredPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load blog posts');
      }
    };
    
    loadData();
  }, [fetchFilteredPosts, refetchPosts]);

  // Effect for sorting popular posts
  useEffect(() => {
    if (allPosts && allPosts.length > 0) {
      const sorted = [...allPosts]
        .sort((a, b) => {
          const aEngagement = a.likes + a.comments.length;
          const bEngagement = b.likes + b.comments.length;
          return bEngagement - aEngagement;
        })
        .slice(0, 5);
      
      setPopularPosts(sorted);
    }
  }, [allPosts]);
  
  // Find potential matches based on blog interactions
  useEffect(() => {
    const findPotentialMatches = () => {
      setIsLoadingTrending(true);
      try {
        if (!allPosts || allPosts.length === 0 || !currentUser) {
          setTrendingUsers([]);
          return;
        }

        const userInteractions = new Map();
        
        // Count interactions with other users' posts
        allPosts.forEach(post => {
          if (post.userId !== currentUser?.id) {
            // Check if current user liked or commented on this post
            const hasCommented = post.comments.some(comment => comment.userId === currentUser?.id);
            
            if (hasCommented) {
              const count = userInteractions.get(post.userId) || 0;
              userInteractions.set(post.userId, count + 1);
            }
          }
        });
        
        // Sort by interaction count and return top 3
        const potentialMatchIds = Array.from(userInteractions.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([userId]) => userId);

        setTrendingUsers(potentialMatchIds);
      } catch (error) {
        console.error('Error finding potential matches:', error);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    findPotentialMatches();
  }, [allPosts, currentUser]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-love text-transparent bg-clip-text">Community Posts</h1>
              <p className="text-muted-foreground">Share your thoughts and connect with others</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="my-posts" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  My Posts
                </TabsTrigger>
                <TabsTrigger value="explore" className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  Explore
                </TabsTrigger>
                <TabsTrigger value="for-you" className="flex-1">
                  <Zap className="mr-2 h-4 w-4" />
                  For You
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-posts" className="focus-visible:outline-none focus-visible:ring-0">
                <Blog />
              </TabsContent>
              
              <TabsContent value="explore" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  {isLoadingPosts ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} className="w-full">
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))
                  ) : allPosts.length > 0 ? (
                    allPosts.map(post => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onClick={() => navigate(`/blog/${post.id}`)} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No posts to display.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="for-you" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  {isLoadingPosts ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index} className="w-full">
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))
                  ) : filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onClick={() => navigate(`/blog/${post.id}`)} 
                        recommended
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No posts match your interests yet.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('explore')}
                        className="mt-2"
                      >
                        Explore all posts
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3 space-y-6">
            {/* Popular Posts */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-love-500" />
                  Popular Posts
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoadingPosts ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-2">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))
                  ) : popularPosts.length > 0 ? (
                    popularPosts.map(post => (
                      <div 
                        key={post.id}
                        className="p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{post.likes} likes</span>
                          <span className="mx-1">•</span>
                          <span>{post.comments.length} comments</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No popular posts yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Potential Matches Based on Blog Interactions */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Potential Matches
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {isLoadingTrending ? (
                    Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="p-2">
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))
                  ) : trendingUsers.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Based on your blog interactions, you might be interested in:
                      </p>
                      {trendingUsers.map((userId) => (
                        <Button 
                          key={userId}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => navigate(`/profile/${userId}`)}
                        >
                          View Profile
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Interact with more posts to discover potential matches!
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm mt-2"
                        onClick={() => setActiveTab('explore')}
                      >
                        Start exploring
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Post card component for displaying posts in lists
const PostCard = ({ post, onClick, recommended = false }: { post: BlogPostType; onClick: () => void; recommended?: boolean }) => {
  const { currentUser } = useUser();
  const isOwner = post.userId === currentUser?.id;
  
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        {recommended && (
          <div className="mb-2 inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            <Zap className="h-3 w-3 mr-1" />
            Recommended for you
          </div>
        )}
        <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {isOwner ? "You" : "Anonymous user"} • {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="line-clamp-2 text-sm mb-3">{post.content}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{post.likes} likes</span>
          <span className="mx-1">•</span>
          <span>{post.comments.length} comments</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPage;
