
import React, { ReactNode } from 'react';
import ErrorBoundary from '../error-boundary/ErrorBoundary';
import LoadingIndicator from './loading-indicator';

interface AsyncContentProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyContent?: ReactNode;
  loadingContent?: ReactNode;
  errorContent?: ReactNode;
  children: ReactNode;
}

const AsyncContent: React.FC<AsyncContentProps> = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyContent,
  loadingContent,
  errorContent,
  children
}) => {
  // Render loading state
  if (isLoading) {
    return loadingContent || (
      <div className="flex justify-center items-center py-8">
        <LoadingIndicator />
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return errorContent || (
      <div className="p-4 bg-red-50 text-red-700 rounded-md flex flex-col items-center">
        <p className="text-center font-medium mb-2">Something went wrong</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }
  
  // Render empty state
  if (isEmpty) {
    return emptyContent || (
      <div className="py-8 text-center text-muted-foreground">
        No data found
      </div>
    );
  }
  
  // Render content
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default AsyncContent;
