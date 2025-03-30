
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
}

interface ProfilePostsProps {
  userId: string;
  posts: Post[];
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ userId, posts }) => {
  const navigate = useNavigate();

  if (!posts || posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
        <p className="text-gray-500 text-sm">This user hasn't published any posts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold tracking-tight">Published Posts</h3>
      
      <div className="grid gap-6">
        {posts.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
              {post.imageUrl && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              
              <CardContent className="p-4 pt-5">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar size={14} className="mr-1" />
                  <span>{post.date}</span>
                </div>
                
                <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-slate-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-600">
                      <Heart size={16} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-gray-600">
                      <MessageCircle size={16} />
                      <span>{post.comments}</span>
                    </Button>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Share2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;
