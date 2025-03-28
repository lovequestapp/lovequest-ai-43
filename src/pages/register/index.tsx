
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill out all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            email
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // If successfully registered
      if (data.user) {
        // Insert into profiles table (though there should be a trigger handling this)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name,
            email,
            age: 25, // Default value
            bio: '',
            location: '',
            interests: [],
            photos: [],
            gender: 'non-binary',
            interested_in: [],
            premium_status: 'basic',
            role: 'subscriber',
            is_verified: false,
            is_banned: false,
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Continue anyway since the auth trigger should handle it
        }
          
        // Create user object to store in context
        const newUser = {
          id: data.user.id,
          name,
          email,
          age: 25, // Default value
          photos: [],
          bio: '',
          location: '',
          interests: [],
          gender: 'non-binary' as const,
          interestedIn: [],
          popularityPoints: 0,
          premiumStatus: 'basic' as const,
          role: 'subscriber' as const,
          isBanned: false,
          verificationStatus: 'unverified' as const,
          personalityTraits: [],
          giftInventory: { rose: 0, heart: 0, teddy: 0 },
          receivedGifts: { rose: 0, heart: 0, teddy: 0 },
          compatibilityScore: 0,
        };
        
        // Set the current user
        setCurrentUser(newUser);
        
        toast.success("Account created successfully!");
        navigate('/profile');
      } else {
        // If no session, they need to verify their email
        toast.info("Please check your email to confirm your registration");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Provide user-friendly error messages
      if (error.message?.includes("User already registered")) {
        toast.error("This email is already registered. Please try logging in instead.");
      } else {
        toast.error(error.message || "An error occurred during registration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-display">Create Account</CardTitle>
          <CardDescription>Sign up to find your perfect match</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password" 
                required
                minLength={8}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-love"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-love-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
