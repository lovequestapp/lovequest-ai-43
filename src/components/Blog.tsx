import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUser } from '@/context/UserContext';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { FilePen, FileText, Heart, MessageSquare, Plus, Share, Send, Trash, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";
import { BlogPostType } from '@/types/user';

interface BlogPostProps {
  post: BlogPostType;
  isOwner: boolean;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, isOwner, onEdit, onDelete, onLike, onComment }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
  
  const handleCommentSubmit = () => {
    if (comment.trim()) {
      onComment(post.id, comment);
      setComment('');
      toast.success("Comment added!");
    }
  };
  
  const handleViewFullPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/blog/${post.id}`);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            <span className="cursor-pointer hover:underline" onClick={handleViewFullPost}>
              {post.title}
            </span>
          </CardTitle>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onEdit(post.id)}>
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
                <Trash size={16} className="text-destructive" />
              </Button>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="mb-4 whitespace-pre-line cursor-pointer" onClick={handleViewFullPost}>
          {post.content}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
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
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
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
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
            >
              <MessageSquare size={16} />
              <span>{post.comments.length}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: `Check out this post: ${post.title}`,
                    url: `${window.location.origin}/blog/${post.id}`,
                  })
                  .then(() => toast.success("Shared successfully!"))
                  .catch((error) => console.log('Error sharing:', error));
                } else {
                  // Fallback for browsers that don't support the Web Share API
                  navigator.clipboard.writeText(`${window.location.origin}/blog/${post.id}`);
                  toast.success("Link copied to clipboard!");
                }
              }}
            >
              <Share size={16} />
              <span>Share</span>
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewFullPost}
          >
            View Post
          </Button>
        </div>
      </CardContent>
      
      {showComments && (
        <div className="px-6 pb-4">
          <Separator className="mb-4" />
          
          <div className="space-y-4 mb-4">
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
            <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

interface CreatePostDialogProps {
  onCreatePost: (title: string, content: string, tags: string[]) => void;
  initialData?: {
    id: string;
    title: string;
    content: string;
    tags: string[];
  };
  isEditing?: boolean;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ 
  onCreatePost, 
  initialData, 
  isEditing = false 
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onCreatePost(title.trim(), content.trim(), tags);
      setOpen(false);
      
      // Reset form if not editing
      if (!isEditing) {
        setTitle('');
        setContent('');
        setTags([]);
      }
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-love hover:opacity-90 gap-2">
          {isEditing ? (
            <>
              <FilePen size={16} />
              <span>Edit Post</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>New Post</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, experiences, or stories..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
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
                      <Trash size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="submit" className="bg-gradient-love hover:opacity-90">
              {isEditing ? 'Update Post' : 'Publish Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Blog: React.FC = () => {
  const { currentUser } = useUser();
  const { 
    allPosts, 
    createPost, 
    updatePost, 
    deletePost, 
    likePost, 
    commentOnPost, 
    fetchUserPosts
  } = useBlogPosts();
  
  const [userPosts, setUserPosts] = useState<BlogPostType[]>([]);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    title: string;
    content: string;
    tags: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserPosts = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          const posts = await fetchUserPosts(currentUser.id);
          setUserPosts(posts);
        } catch (error) {
          console.error("Error loading user posts:", error);
          toast.error("Failed to load your posts");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadUserPosts();
  }, [currentUser, fetchUserPosts]);
  
  if (!currentUser) return null;
  
  const handleCreatePost = (title: string, content: string, tags: string[]) => {
    createPost({
      title,
      content,
      tags,
      userId: currentUser.id
    });
  };
  
  const handleUpdatePost = (title: string, content: string, tags: string[]) => {
    if (editingPost) {
      updatePost(editingPost.id, { title, content, tags });
      setEditingPost(null);
    }
  };
  
  const handleEditPost = (postId: string) => {
    const post = userPosts.find(p => p.id === postId);
    if (post) {
      setEditingPost({
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags
      });
    }
  };
  
  const handleDeletePost = (postId: string) => {
    deletePost(postId);
  };
  
  const handleLikePost = (postId: string) => {
    likePost(postId);
  };
  
  const handleCommentPost = (postId: string, comment: string) => {
    commentOnPost(postId, comment);
  };
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Loading your posts...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="text-love-500" />
          <span>My Blog Posts</span>
        </h2>
        
        <div className="flex gap-4">
          {editingPost ? (
            <CreatePostDialog 
              onCreatePost={handleUpdatePost} 
              initialData={editingPost}
              isEditing
            />
          ) : (
            <CreatePostDialog onCreatePost={handleCreatePost} />
          )}
        </div>
      </div>
      
      {userPosts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <FileText size={48} className="text-muted-foreground" />
            <h3 className="text-xl font-medium">No Posts Yet</h3>
            <p className="text-muted-foreground mb-4">
              Share your thoughts, experiences, and stories to connect with others.
            </p>
            <CreatePostDialog onCreatePost={handleCreatePost} />
          </div>
        </Card>
      ) : (
        <div>
          {userPosts.map(post => (
            <BlogPost 
              key={post.id}
              post={post}
              isOwner={true}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onLike={handleLikePost}
              onComment={handleCommentPost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
