
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onSendImage: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ isOpen, onClose, onSendImage }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPreviewUrl(event.target.result);
          // In a real app, you would upload the image to a server here
          // and set the returned URL. For demo purposes, we use the local URL.
          setImageUrl(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSend = () => {
    if (imageUrl) {
      onSendImage(imageUrl);
      setImageUrl('');
      setPreviewUrl('');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send an Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="image-upload" className="cursor-pointer">
            {previewUrl ? (
              <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md text-gray-400">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span>Click to upload an image</span>
              </div>
            )}
          </Label>
          <Input 
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend} disabled={!imageUrl}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploader;
