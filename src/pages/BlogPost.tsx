
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useUser } from '@/context/UserContext';
import { BlogPostType } from '@/types/user';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageSquare, Share, Send, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { findPostById, likePost, commentOnPost, updatePost } = useBlogPosts();
  const { currentUser, sendGift } = useUser();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      setIsLoading(true);
      try {
        const postData = await findPostById(postId);
        if (postData) {
          setPost(postData);
        } else {
          toast.error("Post not found");
          navigate('/blog');
        }
      } catch (error) {
        console.error("Error loading post:", error);
        toast.error("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPost();
  }, [postId, findPostById, navigate]);
  
  const handleLike = async () => {
    if (!post) return;
    
    try {
      await likePost(post.id);
      // Update local state to reflect the like
      setPost(prevPost => prevPost ? { ...prevPost, likes: prevPost.likes + 1 } : null);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  
  const handleCommentSubmit = async () => {
    if (!post || !comment.trim()) return;
    
    setSendingComment(true);
    try {
      await commentOnPost(post.id, comment);
      // Add the comment locally
      const newComment = {
        id: `temp-${Date.now()}`,
        userId: currentUser?.id || '',
        userName: currentUser?.name || 'You',
        content: comment,
        createdAt: new Date().toISOString()
      };
      
      setPost(prevPost => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: [...prevPost.comments, newComment]
        };
      });
      
      setComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSendingComment(false);
    }
  };
  
  const handleSendGift = async (giftType: 'rose' | 'heart' | 'teddy') => {
    if (!post || !post.userId) {
      toast.error("Cannot send gift - no recipient found");
      return;
    }
    
    try {
      await sendGift(post.userId, giftType);
      toast.success(`You sent a ${giftType} to the author!`);
      setIsGiftDialogOpen(false);
    } catch (error) {
      console.error("Error sending gift:", error);
      toast.error("Failed to send gift");
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Shared post',
        text: `Check out this post: ${post?.title}`,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <div className="animate-pulse">
            <div className="h-10 w-3/4 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-8"></div>
            <div className="h-48 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <FileText size={64} className="text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/blog')}>Return to Blog</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isAuthor = post.userId === currentUser?.id;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft size={16} />
            <span>Back to Blog</span>
          </Button>
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Posted by {isAuthor ? "You" : post.userName || "Anonymous"} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-lg">{post.content}</p>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-love-50 text-love-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-4">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1" 
                      onClick={handleLike}
                    >
                      <Heart 
                        size={16} 
                        className={post.likes > 0 ? "text-love-500 fill-love-500" : ""}
                      />
                      <span>{post.likes} likes</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1"
                    >
                      <MessageSquare size={16} />
                      <span>{post.comments.length} comments</span>
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog open={isGiftDialogOpen} onOpenChange={setIsGiftDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1">
                          <Gift size={16} />
                          <span>Send Gift</span>
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send a gift</DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-3 gap-4 py-4">
                          <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all" onClick={() => handleSendGift('rose')}>
                            <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center mb-2">
                              <span className="text-4xl">🌹</span>
                            </div>
                            <span>Rose</span>
                          </div>
                          
                          <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all" onClick={() => handleSendGift('heart')}>
                            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-2">
                              <span className="text-4xl">❤️</span>
                            </div>
                            <span>Heart</span>
                          </div>
                          
                          <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all" onClick={() => handleSendGift('teddy')}>
                            <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                              <span className="text-4xl">🧸</span>
                            </div>
                            <span>Teddy</span>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsGiftDialogOpen(false)}>
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" onClick={handleShare} className="flex items-center gap-1">
                      <Share size={16} />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <Textarea 
                      placeholder="Add a comment..." 
                      className="flex-1" 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button 
                      disabled={!comment.trim() || sendingComment} 
                      onClick={handleCommentSubmit}
                    >
                      {sendingComment ? (
                        <span className="animate-spin mr-1">⌛</span>
                      ) : (
                        <Send size={16} />
                      )}
                    </Button>
                  </div>
                  
                  {post.comments.length > 0 ? (
                    <div className="space-y-4 pt-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-medium">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="mt-2">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                      <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

// Add the missing FileText icon import
const FileText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

export default BlogPost;
