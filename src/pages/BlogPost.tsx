
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageSquare, Share, User, ArrowLeft, Gift, Send } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { formatDistanceToNow } from 'date-fns';
import GiftSelector from '@/components/GiftSelector';
import { toast } from "sonner";

const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { currentUser, getAllPosts, likeBlogPost, commentOnBlogPost } = useUser();
  const [comment, setComment] = useState('');
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  
  useEffect(() => {
    // Log that we've reached the BlogPost page
    console.log(`BlogPost page loaded for postId: ${postId}`);
  }, [postId]);
  
  if (!currentUser) return null;
  
  const allPosts = getAllPosts();
  const post = allPosts.find(p => p.id === postId);
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate('/explore')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
          </Button>
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-xl font-medium">Post Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/explore')}>
                Return to Explore
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isCurrentUser = post.userId === currentUser.id;
  const author = isCurrentUser 
    ? currentUser.name 
    : allPosts.find(p => p.userId === post.userId)?.comments[0]?.userName || 'Unknown';
  
  const handleLike = () => {
    likeBlogPost(post.id, post.userId);
    toast.success("You liked this post!");
  };
  
  const handleComment = () => {
    if (comment.trim()) {
      commentOnBlogPost(post.id, comment);
      setComment('');
      toast.success("Comment added successfully!");
    }
  };
  
  const handleSendGift = (giftType: 'rose' | 'heart' | 'teddy') => {
    // Send the gift and close the dialog
    if (currentUser.giftInventory && currentUser.giftInventory[giftType] > 0) {
      // This is a simplified implementation since the UserContext doesn't have a direct 
      // method to send gifts to posts, but this would be the logical place to add it
      commentOnBlogPost(post.id, `I sent you a ${giftType}! 💝`);
      toast.success(`You sent a ${giftType}!`);
      // In a real implementation, you would update the gift count for the post
      // For now, we'll just add a comment
    }
    setShowGiftDialog(false);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Check out this post: ${post.title}`,
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/explore')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto flex items-center gap-1 text-muted-foreground text-sm"
            >
              <User size={14} />
              <span>{author}</span>
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-line">{post.content}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-love-50 text-love-700">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleLike}
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
                  className="flex items-center gap-1"
                >
                  <MessageSquare size={16} />
                  <span>{post.comments.length}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleShare}
                >
                  <Share size={16} />
                  <span>Share</span>
                </Button>
              </div>
              
              <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Gift size={16} />
                    <span>Send Gift</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send a Gift</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Choose a gift to send to the author of this post:
                    </p>
                    
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline" 
                        className="flex flex-col items-center p-4" 
                        onClick={() => handleSendGift('rose')}
                        disabled={!currentUser.giftInventory || currentUser.giftInventory.rose <= 0}
                      >
                        <span className="text-3xl mb-2">🌹</span>
                        <span>Rose</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {currentUser.giftInventory?.rose || 0} available
                        </span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex flex-col items-center p-4" 
                        onClick={() => handleSendGift('heart')}
                        disabled={!currentUser.giftInventory || currentUser.giftInventory.heart <= 0}
                      >
                        <span className="text-3xl mb-2">❤️</span>
                        <span>Heart</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {currentUser.giftInventory?.heart || 0} available
                        </span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex flex-col items-center p-4" 
                        onClick={() => handleSendGift('teddy')}
                        disabled={!currentUser.giftInventory || currentUser.giftInventory.teddy <= 0}
                      >
                        <span className="text-3xl mb-2">🧸</span>
                        <span>Teddy</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {currentUser.giftInventory?.teddy || 0} available
                        </span>
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowGiftDialog(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
          
          <div className="px-6 pb-6">
            <Separator className="mb-6" />
            
            <h3 className="font-semibold mb-4">Comments</h3>
            
            <div className="space-y-4 mb-6">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Textarea 
                placeholder="Write a comment..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[60px]"
              />
              <Button onClick={handleComment} disabled={!comment.trim()}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
