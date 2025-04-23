
import { useUser } from '@/context/UserContext';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { BlogPostType, BlogComment } from '@/types/user';
import { useAsyncQuery } from './useAsyncQuery';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Helper function to transform Supabase blog posts to our BlogPostType
  const transformSupabasePosts = (posts: any[]): BlogPostType[] => {
    return posts.map(post => ({
      id: post.id.toString(),
      userId: post.user_id,
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      likes: post.likes_count || 0,
      comments: Array.isArray(post.comments) ? post.comments : [],
      userName: post.profiles?.name || 'Anonymous'
    }));
  };
  
  // Fetch all posts
  const fetchAllPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch from Supabase first
      try {
        const { data: supabasePosts, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles (name)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (supabasePosts && supabasePosts.length > 0) {
          // Transform to expected format
          const formattedPosts = transformSupabasePosts(supabasePosts);
          setAllBlogPosts(formattedPosts);
          return formattedPosts;
        }
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock data
      }
      
      // Fallback to context API if Supabase fetch fails
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
      
      // Try Supabase first
      try {
        const { data: userPosts, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles (name)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (userPosts && userPosts.length > 0) {
          // Transform to expected format
          const formattedPosts = transformSupabasePosts(userPosts);
          setUserBlogPosts(formattedPosts);
          return formattedPosts;
        }
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock data
      }
      
      // Fallback
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
      
      // Try with Supabase
      if (filter) {
        try {
          const { data: filteredPosts, error } = await supabase
            .from('blog_posts')
            .select(`
              *,
              profiles (name)
            `)
            .ilike('title', `%${filter}%`)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          if (filteredPosts && filteredPosts.length > 0) {
            // Transform to expected format
            const formattedPosts = transformSupabasePosts(filteredPosts);
            setFilteredBlogPosts(formattedPosts);
            return formattedPosts;
          }
        } catch (supabaseError) {
          console.error('Supabase error:', supabaseError);
        }
      }
      
      // Fallback
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
    try {
      // Try with Supabase
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles (name)
        `)
        .eq('id', postId)
        .single();
        
      if (error) throw error;
      
      if (post) {
        return {
          id: post.id.toString(),
          userId: post.user_id,
          title: post.title,
          content: post.content,
          tags: post.tags || [],
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          likes: post.likes_count || 0,
          comments: Array.isArray(post.comments) ? post.comments : [],
          userName: post.profiles?.name || 'Anonymous'
        };
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
    }
    
    // Fallback to local posts
    const posts = await fetchAllPosts();
    return posts.find(post => post.id === postId) || null;
  }, [fetchAllPosts]);
  
  // Create post
  const handleCreatePost = async (post: Omit<BlogPostType, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => {
    try {
      // Try with Supabase first
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title: post.title,
            content: post.content,
            tags: post.tags,
            user_id: post.userId
          })
          .select();
          
        if (error) throw error;
        
        if (data) {
          toast.success('Post created successfully');
          fetchAllPosts();
          fetchPostsByUser(post.userId);
          return true;
        }
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock
      }
      
      // Fallback
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
      // Try with Supabase first
      try {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: data.title,
            content: data.content,
            tags: data.tags,
            updated_at: new Date().toISOString()
          })
          .eq('id', postId);
          
        if (error) throw error;
        
        toast.success('Post updated successfully');
        fetchAllPosts();
        if (data.userId) {
          fetchPostsByUser(data.userId);
        }
        return true;
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock
      }
      
      // Fallback
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
      // Try with Supabase first
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);
          
        if (error) throw error;
        
        toast.success('Post deleted successfully');
        fetchAllPosts();
        return true;
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock
      }
      
      // Fallback
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
      // Try with Supabase first
      try {
        // First get the current post
        const { data: post, error: fetchError } = await supabase
          .from('blog_posts')
          .select('likes_count')
          .eq('id', postId)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Increment likes
        const newLikesCount = (post?.likes_count || 0) + 1;
        
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ likes_count: newLikesCount })
          .eq('id', postId);
          
        if (updateError) throw updateError;
        
        toast.success('Post liked');
        fetchAllPosts();
        return true;
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock
      }
      
      // Fallback
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
      // Try with Supabase first
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) throw new Error('User not authenticated');
        
        // Get current comments
        const { data: post, error: fetchError } = await supabase
          .from('blog_posts')
          .select('comments')
          .eq('id', postId)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Add new comment
        const newComment = {
          id: Date.now().toString(),
          userId: userData.user.id,
          userName: userData.user.user_metadata?.name || 'Anonymous',
          content: comment,
          createdAt: new Date().toISOString()
        };
        
        const comments = Array.isArray(post?.comments) ? [...post.comments, newComment] : [newComment];
        
        // Update comments
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ comments })
          .eq('id', postId);
          
        if (updateError) throw updateError;
        
        toast.success('Comment added');
        fetchAllPosts();
        return true;
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock
      }
      
      // Fallback
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
