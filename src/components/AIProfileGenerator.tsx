
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIProfileGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
  gender?: 'male' | 'female' | 'non-binary';
}

const AIProfileGenerator: React.FC<AIProfileGeneratorProps> = ({
  onImageGenerated,
  gender = 'female'
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // These are pre-generated AI profile images to avoid actual API calls in the demo
  const aiGeneratedImages = {
    male: [
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
    ],
    female: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&q=80'
    ],
    'non-binary': [
      'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80',
      'https://images.unsplash.com/photo-1540875716262-8c2b2d30c1c6?w=400&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80',
      'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=400&q=80'
    ]
  };

  const generateImage = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly select an image from our pre-generated collection
      const images = aiGeneratedImages[gender];
      const randomIndex = Math.floor(Math.random() * images.length);
      const imageUrl = images[randomIndex];
      
      onImageGenerated(imageUrl);
      
      toast({
        title: "Profile Image Generated",
        description: "Your AI-generated profile image is ready!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate profile image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={generateImage}
      variant="outline" 
      disabled={loading}
      className="w-full flex items-center gap-2"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
      <span>{loading ? "Generating..." : "Generate AI Profile Image"}</span>
    </Button>
  );
};

export default AIProfileGenerator;
