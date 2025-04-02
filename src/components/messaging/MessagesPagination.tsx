
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationPrevious, 
  PaginationNext 
} from "@/components/ui/pagination";

interface MessagesPaginationProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

const MessagesPagination: React.FC<MessagesPaginationProps> = ({ 
  hasMore, 
  isLoading, 
  onLoadMore 
}) => {
  if (!hasMore) return null;
  
  return (
    <div className="flex justify-center my-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onLoadMore} 
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Load older messages'}
      </Button>
    </div>
  );
};

export default MessagesPagination;
