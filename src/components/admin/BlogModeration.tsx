
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import { BlogPostType } from '@/types/user';
import { Check, Eye, Flag, MessageSquare, Shield, Trash, XCircle } from 'lucide-react';

const BlogModeration = () => {
  const { getAllPosts, deleteBlogPost } = useUser();
  const [viewingPost, setViewingPost] = useState<BlogPostType | null>(null);
  const [flaggedPosts, setFlaggedPosts] = useState<Set<string>>(new Set());
  const [approvedPosts, setApprovedPosts] = useState<Set<string>>(new Set());
  
  const allPosts = getAllPosts();
  
  const handleViewPost = (post: BlogPostType) => {
    setViewingPost(post);
  };
  
  const handleFlagPost = (postId: string) => {
    setFlaggedPosts(prev => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });
    toast.success("Post has been flagged for review");
  };
  
  const handleApprovePost = (postId: string) => {
    setFlaggedPosts(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
    setApprovedPosts(prev => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });
    toast.success("Post has been approved");
  };
  
  const handleDeletePost = (postId: string) => {
    deleteBlogPost(postId);
    setViewingPost(null);
    toast.success("Post has been deleted");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Shield className="mr-2 h-5 w-5 text-love-500" />
            Blog Content Moderation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPosts.map((post) => {
                  const isFlagged = flaggedPosts.has(post.id);
                  const isApproved = approvedPosts.has(post.id);
                  
                  return (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {post.title}
                      </TableCell>
                      <TableCell>User {post.userId.slice(0, 6)}</TableCell>
                      <TableCell>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {isFlagged ? (
                          <Badge variant="destructive" className="text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            Flagged
                          </Badge>
                        ) : isApproved ? (
                          <Badge variant="success" className="bg-green-100 text-green-800 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {post.comments.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewPost(post)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {!isApproved && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleApprovePost(post.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {!isFlagged && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-amber-600"
                              onClick={() => handleFlagPost(post.id)}
                            >
                              <Flag className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {allPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No blog posts to moderate
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Post viewer dialog */}
      <Dialog open={viewingPost !== null} onOpenChange={(open) => !open && setViewingPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingPost?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="text-sm text-muted-foreground">
              Posted by User {viewingPost?.userId.slice(0, 6)} on {viewingPost && new Date(viewingPost.createdAt).toLocaleDateString()}
            </div>
            
            <div className="whitespace-pre-line">
              {viewingPost?.content}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {viewingPost?.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Comments ({viewingPost?.comments.length || 0})</h4>
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {viewingPost?.comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                ))}
                {!viewingPost?.comments.length && (
                  <p className="text-sm text-muted-foreground">No comments on this post</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            {viewingPost && !approvedPosts.has(viewingPost.id) && (
              <Button 
                variant="outline" 
                className="text-green-600"
                onClick={() => viewingPost && handleApprovePost(viewingPost.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}
            
            {viewingPost && !flaggedPosts.has(viewingPost.id) && (
              <Button 
                variant="outline"
                className="text-amber-600"
                onClick={() => viewingPost && handleFlagPost(viewingPost.id)}
              >
                <Flag className="h-4 w-4 mr-2" />
                Flag
              </Button>
            )}
            
            <Button 
              variant="destructive"
              onClick={() => viewingPost && handleDeletePost(viewingPost.id)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogModeration;
