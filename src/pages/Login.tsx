
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { authService } from '@/services/authService';
import { isSessionValid, refreshSession } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/security';
import { useIsMobile } from '@/hooks/use-mobile';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useUser();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, message: '' });
  
  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      // If we have a valid session, redirect to profile
      const sessionValid = await isSessionValid();
      
      if (sessionValid) {
        // If user came from a specific location, return there
        const returnPath = new URLSearchParams(location.search).get('returnTo');
        if (returnPath) {
          navigate(returnPath);
        } else {
          navigate('/profile');
        }
      }
    };
    
    checkExistingSession();
  }, [navigate, location]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please enter your email and password');
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const user = await authService.login({
        email: loginEmail,
        password: loginPassword
      });
      
      if (user) {
        // Update UserContext with the logged in user
        setCurrentUser(user);
        
        // Refresh session token to ensure it's valid
        await refreshSession();
        
        toast.success('Logged in successfully!');
        
        // Redirect admin users to the admin page, others to profile
        if (user.role === 'admin') {
          toast.success('Welcome, Admin!');
          navigate('/admin');
        } else {
          // Check if we have a returnTo parameter
          const returnPath = new URLSearchParams(location.search).get('returnTo');
          if (returnPath) {
            navigate(returnPath);
          } else {
            navigate('/profile');
          }
        }
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Error logging in. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!passwordStrength.isValid) {
      toast.error(passwordStrength.message);
      return;
    }
    
    // Navigate to subscription selection
    navigate('/register', { 
      state: { 
        name: registerName, 
        email: registerEmail, 
        password: registerPassword 
      } 
    });
  };
  
  const checkPasswordStrength = (password: string) => {
    const result = validatePasswordStrength(password);
    setPasswordStrength(result);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className={`w-full ${isMobile ? 'max-w-full' : 'max-w-md'} mx-auto`}>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Create Account</TabsTrigger>
                </TabsList>
              </div>
              <CardTitle className="text-2xl font-display text-center">
                {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === 'login' 
                  ? 'Enter your credentials to access your account' 
                  : 'Sign up to start finding your perfect match'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="login-password" 
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-love" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input 
                      id="register-name" 
                      type="text" 
                      placeholder="Your Name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="register-password" 
                        type={showPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => {
                          setRegisterPassword(e.target.value);
                          checkPasswordStrength(e.target.value);
                        }}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {registerPassword && (
                      <p className={`text-xs mt-1 ${passwordStrength.isValid ? 'text-green-600' : 'text-red-500'}`}>
                        {passwordStrength.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <Input 
                      id="register-confirm" 
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      required
                    />
                    {registerPassword && registerConfirmPassword && (
                      <p className={`text-xs mt-1 ${registerPassword === registerConfirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                        {registerPassword === registerConfirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-love" 
                    disabled={isRegistering}
                  >
                    Next: Choose Subscription
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-center text-muted-foreground">
                {activeTab === 'login' ? (
                  <span>
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      className="text-love-600 hover:underline font-semibold"
                      onClick={() => setActiveTab('register')}
                    >
                      Sign up
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button 
                      type="button"
                      className="text-love-600 hover:underline font-semibold"
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </button>
                  </span>
                )}
              </div>
            </CardFooter>
          </Tabs>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
