import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/security';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, message: '' });
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SignUp form submitted');

    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!passwordStrength.isValid) {
      toast.error(passwordStrength.message);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to sign up with:', { email, name });
      // Default to free plan
      const result = await signUp(email, password, name, 'free');
      console.log('Sign up result:', result);

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          toast.success('Registration successful!', {
            description: 'Please check your email to confirm your account'
          });
          // Stay on the signup page
        } else {
          toast.success('Registration successful!');
          navigate('/profile');
        }
      } else {
        toast.error('Registration failed', { 
          description: result.error 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', { 
        description: 'An unexpected error occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const result = validatePasswordStrength(password);
    setPasswordStrength(result);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-display">Create an Account</CardTitle>
        <CardDescription>
          Sign up to start finding your perfect match
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <p className={`text-xs mt-1 ${passwordStrength.isValid ? 'text-green-600' : 'text-red-500'}`}>
                {passwordStrength.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            {password && confirmPassword && (
              <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
