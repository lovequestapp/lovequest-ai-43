
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const EmailConfirmSuccess = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  
  useEffect(() => {
    if (authenticated) {
      // If the user is already authenticated, redirect to verification
      const timer = setTimeout(() => {
        navigate('/verification');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [authenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${success ? 'bg-green-100' : 'bg-red-100'}`}>
                  {success ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>
              <CardTitle className="text-center">
                {success ? 'Email Confirmed' : 'Confirmation Failed'}
              </CardTitle>
              <CardDescription className="text-center">
                {success 
                  ? 'Your email has been successfully verified'
                  : 'We were unable to verify your email'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {success ? (
                <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800">
                  <p>
                    Your email address has been successfully verified. You can now proceed with the account verification process.
                  </p>
                  {authenticated && (
                    <p className="mt-2">
                      You'll be redirected to the verification page in a few seconds...
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg text-sm text-red-800">
                  <p>
                    There was a problem confirming your email. The link may have expired or is invalid.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {success ? (
                <>
                  {!authenticated && (
                    <Button 
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      Login to Continue
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EmailConfirmSuccess;
