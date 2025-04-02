
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from '@/context/UserContext';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogPostType } from '@/types/user';
import { 
  Trash, AlertTriangle, CheckCircle, Flag, Shield, 
  Search, Eye, BookOpen, Filter, X
} from 'lucide-react';
import { toast } from 'sonner';

const BlogModeration: React.FC = () => {
  const { currentUser } = useUser();
  const { allPosts, deletePost, refetchPosts } = useBlogPosts();
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePost, setActivePost] = useState<BlogPostType | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showFlagged, setShowFlagged] = useState(false);
  
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would load posts that need moderation
        setPosts(allPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, [allPosts]);
  
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Shield className="h-16 w-16 text-gray-400" />
          <h3 className="text-xl font-medium">Access Denied</h3>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this area.
          </p>
        </div>
      </Card>
    );
  }
  
  const handleViewPost = (post: BlogPostType) => {
    setActivePost(post);
    setViewDialogOpen(true);
  };
  
  const handleRemovePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      toast.success("Post removed successfully");
    } catch (error) {
      console.error("Error removing post:", error);
      toast.error("Failed to remove post");
    }
  };
  
  const handleApprovePost = (postId: string) => {
    // In a real app, this would call an API to approve the post
    toast.success("Post approved");
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'approved' } : post
    ));
  };
  
  const handleFlagPost = (postId: string) => {
    // In a real app, this would call an API to flag the post
    toast.success("Post flagged for review");
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, isFlagged: true } : post
    ));
  };
  
  const filteredPosts = posts.filter(post => {
    // Filter by search text
    const matchesSearch = searchText === '' || 
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.content.toLowerCase().includes(searchText.toLowerCase());
    
    // Filter by flagged status
    const matchesFlagged = !showFlagged || (post as any).isFlagged === true;
    
    return matchesSearch && matchesFlagged;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Shield className="text-love-500" />
          <span>Blog Moderation</span>
        </h2>
        
        <Button 
          variant="outline" 
          onClick={() => refetchPosts()}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search posts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            id="show-flagged"
            checked={showFlagged}
            onCheckedChange={setShowFlagged}
          />
          <Label htmlFor="show-flagged">Flagged Only</Label>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <Card key={post.id} className={`overflow-hidden ${(post as any).isFlagged ? 'border-amber-300' : ''}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      User ID: {post.userId} • {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <p className="line-clamp-2 text-sm mb-2">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {(post as any).isFlagged && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Flagged</span>
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewPost(post)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleFlagPost(post.id)}
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Flag
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleApprovePost(post.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemovePost(post.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No posts to moderate</p>
        </div>
      )}
      
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Post Review</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setViewDialogOpen(false)} 
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {activePost && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{activePost.title}</h2>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <span>User ID: {activePost.userId}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(activePost.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{activePost.content}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {activePost.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Comments ({activePost.comments.length})</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {activePost.comments.length > 0 ? (
                    activePost.comments.map(comment => (
                      <div key={comment.id} className="bg-muted p-3 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No comments on this post</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between items-center">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (activePost) {
                  handleRemovePost(activePost.id);
                  setViewDialogOpen(false);
                }
              }}
            >
              <Trash className="h-4 w-4 mr-1" />
              Remove Post
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (activePost) {
                    handleFlagPost(activePost.id);
                  }
                }}
              >
                <Flag className="h-4 w-4 mr-1" />
                Flag
              </Button>
              
              <Button 
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (activePost) {
                    handleApprovePost(activePost.id);
                    setViewDialogOpen(false);
                  }
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogModeration;
