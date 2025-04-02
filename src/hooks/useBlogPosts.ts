
import { useUser } from '@/context/UserContext';
import { useState, useCallback, useEffect } from 'react';
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
  
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPostType[]>([]);
  const [userBlogPosts, setUserBlogPosts] = useState<BlogPostType[]>([]);
  const [filteredBlogPosts, setFilteredBlogPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all posts
  const fetchAllPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const posts = await getAllPosts();
      setAllBlogPosts(posts);
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
      setError('Failed to load blog posts');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [getAllPosts]);
  
  // Initial data fetch
  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);
  
  // Fetch posts by user
  const fetchPostsByUser = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const posts = await getUserPosts(userId);
      setUserBlogPosts(posts);
      return posts;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to load user posts');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [getUserPosts]);
  
  // Fetch filtered posts
  const fetchPostsByFilter = useCallback(async (filter: string) => {
    try {
      setIsLoading(true);
      const posts = await getFilteredPosts(filter);
      setFilteredBlogPosts(posts);
      return posts;
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
      toast.error('Failed to load filtered posts');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [getFilteredPosts]);
  
  // Find post by ID
  const findPostById = useCallback(async (postId: string) => {
    const posts = await fetchAllPosts();
    return posts.find(post => post.id === postId) || null;
  }, [fetchAllPosts]);
  
  // Create post
  const handleCreatePost = async (post: Omit<BlogPostType, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => {
    try {
      const success = await createBlogPost(post);
      if (success) {
        toast.success('Post created successfully');
        fetchAllPosts();
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
  
  // Update post
  const handleUpdatePost = async (postId: string, data: Partial<BlogPostType>) => {
    try {
      const success = await updateBlogPost(postId, data);
      if (success) {
        toast.success('Post updated successfully');
        fetchAllPosts();
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
  
  // Delete post
  const handleDeletePost = async (postId: string) => {
    try {
      const success = await deleteBlogPost(postId);
      if (success) {
        toast.success('Post deleted successfully');
        fetchAllPosts();
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
  
  // Like post
  const handleLikePost = async (postId: string) => {
    try {
      const success = await likeBlogPost(postId);
      if (success) {
        toast.success('Post liked');
        fetchAllPosts();
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
  
  // Comment on post
  const handleCommentOnPost = async (postId: string, comment: string) => {
    try {
      const success = await commentOnBlogPost(postId, comment);
      if (success) {
        toast.success('Comment added');
        fetchAllPosts();
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
    allPosts: allBlogPosts,
    isLoadingPosts: isLoading,
    postsError: error,
    fetchUserPosts: fetchPostsByUser,
    fetchFilteredPosts: fetchPostsByFilter,
    findPostById,
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    likePost: handleLikePost,
    commentOnPost: handleCommentOnPost,
    refetchPosts: fetchAllPosts
  };
};
