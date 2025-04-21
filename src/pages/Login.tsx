import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useAuthRedirect({
    redirectIfAuthenticated: true,
    authenticatedRedirectPath: '/discover'
  });

  const { signIn } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      const result = await signIn(email, password);
      
      if (result.success) {
        console.log("Login successful");
        // Check if profile is incomplete and redirect to profile setup if needed
        if (result.isProfileIncomplete) {
          console.log("Profile incomplete, redirecting to profile setup");
          navigate('/profile-setup');
        } else {
          // Redirect to discover for fully registered users
          console.log("Profile complete, redirecting to discover");
          navigate('/discover');
        }
      } else {
        console.log("Login failed:", result.error);
        toast.error("Login failed", {
          description: result.error || "Please check your credentials and try again"
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("Login error", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto shadow-md border-love-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display text-love-600">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-love-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-love-100"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">Show password</span>
                  </Button>
                </div>
              </div>
              <Button disabled={isLoading} className="w-full mt-4 bg-love-500 hover:bg-love-600" type="submit">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center w-full">
              Don't have an account? <Link to="/register" className="text-love-500 hover:underline">Sign up</Link>
            </div>
            <div className="text-xs text-muted-foreground text-center w-full">
              <Link to="/" className="hover:underline">Back to Home</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
