
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Log error to an error tracking service here
    // Example: errorTrackingService.logError(error, errorInfo);
  }
  
  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    toast.success("Application has been reset");
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-red-700 mb-3">Something went wrong</h2>
            <p className="text-red-600 mb-4">
              We're sorry, but an unexpected error occurred. Our team has been notified.
            </p>
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-red-500 hover:text-red-700">
                Error details (for developers)
              </summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                {this.state.error?.toString() || "Unknown error"}
              </pre>
            </details>
            <div className="flex space-x-3">
              <Button
                onClick={this.handleReset}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
