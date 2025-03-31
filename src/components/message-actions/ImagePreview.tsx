
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-1">
        <div className="relative w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full"
          >
            <X size={18} />
          </Button>
          <div className="overflow-auto max-h-[80vh] flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt="Enlarged view" 
              className="max-w-full h-auto object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;
