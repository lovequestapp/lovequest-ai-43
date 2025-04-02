
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold text-muted-foreground my-4">404</div>
          <p className="text-muted-foreground mb-4">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
