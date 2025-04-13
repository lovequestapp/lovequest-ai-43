
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, CheckCircle, Upload, Fingerprint, Scan, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface IdentityVerificationProps {
  onVerificationComplete: (
    success: boolean, 
    verificationId?: string, 
    selfieUrl?: string, 
    documentUrl?: string, 
    biometricData?: {
      score: number;
      signature: string;
      faceFeatures: any;
    }
  ) => void;
  onProgressUpdate: (progress: number) => void;
  isProcessing?: boolean;
  withBiometrics?: boolean;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ 
  onVerificationComplete,
  onProgressUpdate,
  isProcessing = false,
  withBiometrics = true
}) => {
  const [step, setStep] = useState(1);
  const [selfieCapture, setSelfieCapture] = useState<string | null>(null);
  const [documentCapture, setDocumentCapture] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [biometricSteps, setBiometricSteps] = useState<string[]>([]);
  const [biometricData, setBiometricData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Start camera with face detection capabilities
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        
        if (withBiometrics) {
          toast.info("Preparing facial recognition...");
          setTimeout(() => performFacialAnalysis(), 1500);
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Camera Access Error", {
        description: "We couldn't access your camera. Please make sure you've granted camera permissions."
      });
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  // Simulated facial analysis with biometric verification
  const performFacialAnalysis = () => {
    setBiometricSteps(['initializing']);
    
    const steps = ['initializing', 'detecting', 'analyzing', 'measuring', 'evaluating', 'complete'];
    let currentStepIndex = 0;
    
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        setBiometricSteps((prev) => [...prev, steps[currentStepIndex]]);
        
        if (steps[currentStepIndex] === 'detecting') {
          toast.info("Please look directly at the camera");
        }
        if (steps[currentStepIndex] === 'analyzing') {
          toast.info("Measuring facial features...");
        }
        if (steps[currentStepIndex] === 'complete') {
          toast.success("Face detected successfully");
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };
  
  const captureSelfie = () => {
    setIsCapturing(true);
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setSelfieCapture(dataUrl);
        
        if (withBiometrics) {
          // Simulate extracting biometric data from the selfie
          generateBiometricSignature(dataUrl);
        } else {
          stopCamera();
          setStep(2);
          onProgressUpdate(40);
          setIsCapturing(false);
        }
      }
    }
  };
  
  const generateBiometricSignature = (imageData: string) => {
    // This is a simulation of biometric data processing
    toast.info("Generating biometric signature");
    
    setTimeout(() => {
      // Generate a fake biometric data object that would contain facial recognition features
      const fakeBiometricData = {
        score: 0.92 + (Math.random() * 0.08), // High confidence score between 0.92-1.0
        signature: `bio-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        faceFeatures: {
          eyeDistance: 62.4 + (Math.random() * 5),
          noseLength: 34.8 + (Math.random() * 3),
          facialSymmetry: 0.89 + (Math.random() * 0.1),
          jawlinePoints: Array(15).fill(0).map(() => Math.floor(Math.random() * 100)),
          // These would be various facial recognition points in a real system
        },
        timestamp: Date.now()
      };
      
      setBiometricData(fakeBiometricData);
      toast.success("Biometric signature created");
      
      stopCamera();
      setStep(2);
      onProgressUpdate(40);
      setIsCapturing(false);
    }, 2000);
  };
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocumentCapture(event.target?.result as string);
        setStep(3);
        onProgressUpdate(70);
        
        if (withBiometrics) {
          toast.info("Analyzing document for authenticity...");
          setTimeout(() => toast.success("Document validated successfully"), 1500);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const simulateVerification = () => {
    setIsCapturing(true);
    
    // Simulate a multi-step verification process
    const totalSteps = withBiometrics ? 7 : 5;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.floor(70 + (currentStep / totalSteps) * 30);
      onProgressUpdate(progress);
      
      const standardMessages = [
        "Analyzing selfie...",
        "Authenticating document...",
        "Comparing facial biometrics...",
        "Verifying document integrity...",
        "Finalizing verification..."
      ];
      
      const biometricMessages = [
        "Analyzing selfie...",
        "Authenticating document...",
        "Performing facial recognition...",
        "Matching biometric signatures...",
        "Analyzing liveness detection...",
        "Verifying document integrity...",
        "Securing biometric data..."
      ];
      
      const messages = withBiometrics ? biometricMessages : standardMessages;
      
      if (currentStep <= messages.length) {
        toast.info(messages[currentStep - 1]);
      }
      
      if (currentStep === messages.length) {
        clearInterval(interval);
        setIsCapturing(false);
        
        // Generate a fake verification ID that looks realistic
        const verificationId = `VID-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().substring(6)}`;
        
        // Call the completion callback with the captures and biometric data
        onVerificationComplete(
          true, 
          verificationId, 
          selfieCapture || undefined, 
          documentCapture || undefined,
          withBiometrics ? biometricData : undefined
        );
      }
    }, 1200);
  };

  const resetVerification = () => {
    setSelfieCapture(null);
    setDocumentCapture(null);
    setBiometricData(null);
    setBiometricSteps([]);
    setStep(1);
    setIsCapturing(false);
    onProgressUpdate(10);
  };
  
  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium mb-2">Step 1: Biometric Selfie</h3>
            <p className="text-sm text-muted-foreground">
              {withBiometrics 
                ? "Please take a clear selfie for facial recognition and biometric verification" 
                : "Please take a clear selfie for facial verification"}
            </p>
          </div>
          
          {!isCameraActive ? (
            <Button 
              onClick={startCamera} 
              className="w-full flex items-center justify-center gap-2"
              disabled={isProcessing || isCapturing}
            >
              <Camera size={18} />
              Access Camera
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black mx-auto" style={{ maxWidth: '400px' }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
                
                {/* Overlay for biometric steps visualization */}
                {withBiometrics && biometricSteps.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-2 right-2 bg-black/60 text-white text-xs p-2 rounded">
                      {biometricSteps.includes('initializing') && (
                        <div className="flex items-center space-x-1">
                          <Scan className="h-3 w-3 text-blue-400" />
                          <span>Initializing facial recognition...</span>
                        </div>
                      )}
                      {biometricSteps.includes('detecting') && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Shield className="h-3 w-3 text-green-400" />
                          <span>Detecting face...</span>
                        </div>
                      )}
                      {biometricSteps.includes('analyzing') && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Fingerprint className="h-3 w-3 text-purple-400" />
                          <span>Analyzing biometric features...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Face detection box - simulated */}
                    {biometricSteps.includes('detecting') && (
                      <div className="absolute inset-8 border-2 border-green-400 rounded-lg animate-pulse"></div>
                    )}
                    
                    {/* Facial landmarks - simulated */}
                    {biometricSteps.includes('measuring') && (
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* These points would be calculated by actual face detection */}
                        <circle cx="30" cy="30" r="1" fill="lime" />
                        <circle cx="70" cy="30" r="1" fill="lime" />
                        <circle cx="50" cy="50" r="1" fill="lime" />
                        <circle cx="30" cy="70" r="1" fill="lime" />
                        <circle cx="70" cy="70" r="1" fill="lime" />
                        <line x1="30" y1="30" x2="70" y2="30" stroke="lime" strokeWidth="0.5" />
                        <line x1="30" y1="30" x2="50" y2="50" stroke="lime" strokeWidth="0.5" />
                        <line x1="70" y1="30" x2="50" y2="50" stroke="lime" strokeWidth="0.5" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={stopCamera} 
                  className="flex-1"
                  disabled={isProcessing || isCapturing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={captureSelfie} 
                  className="flex-1"
                  disabled={isProcessing || isCapturing || (withBiometrics && !biometricSteps.includes('complete'))}
                >
                  {isCapturing ? 'Processing...' : 'Take Photo'}
                </Button>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium mb-2">Step 2: Upload ID Document</h3>
            <p className="text-sm text-muted-foreground">Please upload a government-issued ID (passport, driver's license, etc.)</p>
          </div>
          
          {selfieCapture && (
            <div className="flex justify-center mb-6">
              <div className="relative rounded-lg overflow-hidden border border-input" style={{ width: '150px', height: '150px' }}>
                <img 
                  src={selfieCapture} 
                  alt="Your selfie" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                  <CheckCircle size={16} />
                </div>
                
                {withBiometrics && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs rounded px-1.5 py-0.5 flex items-center">
                    <Fingerprint size={10} className="mr-1" />
                    <span>Bio</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm mb-4">Drag and drop your ID, or click to browse</p>
            <input
              type="file"
              id="document-upload"
              className="hidden"
              accept="image/*"
              onChange={handleDocumentUpload}
              disabled={isProcessing || isCapturing}
            />
            <Button
              onClick={() => document.getElementById('document-upload')?.click()}
              variant="outline"
              disabled={isProcessing || isCapturing}
            >
              Select Document
            </Button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium mb-2">Step 3: Final Verification</h3>
            <p className="text-sm text-muted-foreground">
              {withBiometrics
                ? "Your documents and biometric data have been captured. Click below to complete verification."
                : "Your documents have been captured. Click below to complete verification."}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {selfieCapture && (
              <Card className="overflow-hidden">
                <div className="p-2 bg-muted">
                  <p className="text-xs font-medium">Your Selfie</p>
                </div>
                <div className="p-4">
                  <img 
                    src={selfieCapture} 
                    alt="Your selfie" 
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
                {withBiometrics && biometricData && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Biometric score:</span>{' '}
                      {(biometricData.score * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </Card>
            )}
            
            {documentCapture && (
              <Card className="overflow-hidden">
                <div className="p-2 bg-muted">
                  <p className="text-xs font-medium">Your ID Document</p>
                </div>
                <div className="p-4">
                  <img 
                    src={documentCapture} 
                    alt="Your ID document" 
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              </Card>
            )}
          </div>
          
          <Button
            onClick={simulateVerification}
            disabled={isProcessing || isCapturing}
            className="w-full flex items-center justify-center gap-2"
          >
            <Fingerprint size={18} />
            {isCapturing ? "Verifying..." : withBiometrics ? "Complete Biometric Verification" : "Complete Verification"}
          </Button>
          
          <Button
            variant="outline"
            onClick={resetVerification}
            disabled={isProcessing || isCapturing}
            className="w-full mt-2"
          >
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
};

export default IdentityVerification;
