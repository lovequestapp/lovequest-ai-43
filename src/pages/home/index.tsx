
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-display font-bold mb-6">Find Your Perfect Match</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-xl">
        Discover meaningful connections with our advanced matching algorithm
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/register">
          <Button size="lg" className="bg-gradient-love">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline">Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
