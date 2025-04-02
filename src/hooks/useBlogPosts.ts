
import { useUser } from '@/context/UserContext';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { BlogPostType, BlogComment } from '@/types/user';
import { useAsyncQuery } from './useAsyncQuery';

/**
 * A custom hook for handling blog posts
 */
export const useBlogPosts = () => {
  const { 
    createBlogPost, 
    updateBlogPost, 
    deleteBlogPost, 
    likeBlogPost, 
    commentOnBlogPost, 
    getUserPosts, 
    getAllPosts, 
    getFilteredPosts 
  } = useUser();
  
  const fetchAllPosts = useCallback(async () => {
    try {
      return await getAllPosts();
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
      return [];
    }
  }, [getAllPosts]);
  
  const { 
    data: allPosts, 
    isLoading: isLoadingPosts, 
    error: postsError,
    refetch: refetchPosts
  } = useAsyncQuery(fetchAllPosts, [], []);
  
  const fetchPostsByUser = useCallback(async (userId: string) => {
    try {
      return await getUserPosts(userId);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to load user posts');
      return [];
    }
  }, [getUserPosts]);
  
  const fetchPostsByFilter = useCallback(async (filter: string) => {
    try {
      return await getFilteredPosts(filter);
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
      toast.error('Failed to load filtered posts');
      return [];
    }
  }, [getFilteredPosts]);
  
  const findPostById = useCallback(async (postId: string) => {
    const posts = await fetchAllPosts();
    return posts.find(post => post.id === postId) || null;
  }, [fetchAllPosts]);
  
  const handleCreatePost = async (post: Omit<BlogPostType, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => {
    try {
      const success = await createBlogPost(post);
      if (success) {
        toast.success('Post created successfully');
        refetchPosts();
        return true;
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      return false;
    }
  };
  
  const handleUpdatePost = async (postId: string, data: Partial<BlogPostType>) => {
    try {
      const success = await updateBlogPost(postId, data);
      if (success) {
        toast.success('Post updated successfully');
        refetchPosts();
        return true;
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      return false;
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      const success = await deleteBlogPost(postId);
      if (success) {
        toast.success('Post deleted successfully');
        refetchPosts();
        return true;
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      return false;
    }
  };
  
  const handleLikePost = async (postId: string) => {
    try {
      const success = await likeBlogPost(postId);
      if (success) {
        toast.success('Post liked');
        refetchPosts();
        return true;
      } else {
        throw new Error('Failed to like post');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      return false;
    }
  };
  
  const handleCommentOnPost = async (postId: string, comment: string) => {
    try {
      const success = await commentOnBlogPost(postId, comment);
      if (success) {
        toast.success('Comment added');
        refetchPosts();
        return true;
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      return false;
    }
  };
  
  return {
    allPosts,
    isLoadingPosts,
    postsError,
    fetchUserPosts: fetchPostsByUser,
    fetchFilteredPosts: fetchPostsByFilter,
    findPostById,
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    likePost: handleLikePost,
    commentOnPost: handleCommentOnPost,
    refetchPosts
  };
};
