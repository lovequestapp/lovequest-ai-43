
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { User, ShieldCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import IdentityVerification from '@/components/IdentityVerification';

interface VerificationProcessProps {
  skipVerification?: () => void;
}

const VerificationProcess: React.FC<VerificationProcessProps> = ({ skipVerification }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser, setCurrentUser } = useUser();
  const navigate = useNavigate();
  
  const handleStartVerification = () => {
    setShowVerification(true);
    setStep(2);
  };
  
  const handleProgressUpdate = (progress: number) => {
    setProgress(progress);
  };
  
  const handleVerificationComplete = async (success: boolean, verificationId?: string) => {
    if (!success || !verificationId || !currentUser) {
      toast.error("Verification failed. Please try again later.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Update user's verification status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          verification_status: 'pending',
        })
        .eq('id', currentUser.id);
        
      if (updateError) throw updateError;
      
      // Notify admin of new verification request
      const { data: verificationData } = await supabase
        .functions.invoke('account-verification', {
          body: {
            action: 'notify_admin',
            userId: currentUser.id,
            verificationId,
            biometricScore: 0.85 + (Math.random() * 0.1) // Simulated score between 0.85 and 0.95
          }
        });
      
      console.log('Verification notification sent:', verificationData);
      
      // Update local user state
      setCurrentUser({
        ...currentUser,
        verificationStatus: 'pending'
      });
      
      setStep(3);
      toast.success("Verification submitted successfully!");
    } catch (error) {
      console.error('Error during verification process:', error);
      toast.error("There was a problem submitting your verification.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFinish = () => {
    navigate('/profile');
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Account Verification</h3>
              <p className="text-muted-foreground max-w-md">
                To ensure a safe community, we require identity verification. This helps us prevent fake accounts and protect our users.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">What you'll need:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Your webcam for a selfie photo</li>
                    <li>• A valid government-issued ID (driver's license, passport, etc.)</li>
                    <li>• A few minutes to complete the process</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleStartVerification}
                className="w-full"
              >
                Start Verification
              </Button>
              
              {skipVerification && (
                <Button 
                  variant="outline" 
                  onClick={skipVerification}
                  className="w-full"
                >
                  Skip for Now
                </Button>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Verification in progress...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            <IdentityVerification 
              onVerificationComplete={handleVerificationComplete}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Verification Submitted</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your verification has been submitted successfully. Our team will review your documents shortly.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm">
              <p>
                While your verification is pending, you can still use the app with limited features. We'll notify you once your account is fully verified.
              </p>
            </div>
            
            <Button onClick={handleFinish} className="w-full">
              Continue to Your Profile
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Identity Verification</CardTitle>
        <CardDescription className="text-center">Complete verification to access all features</CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
};

export default VerificationProcess;
