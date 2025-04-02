
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, CheckCircle, Upload, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

interface IdentityVerificationProps {
  onVerificationComplete: (success: boolean, verificationId?: string, selfieUrl?: string, documentUrl?: string) => void;
  onProgressUpdate: (progress: number) => void;
  isProcessing?: boolean;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ 
  onVerificationComplete,
  onProgressUpdate,
  isProcessing = false
}) => {
  const [step, setStep] = useState(1);
  const [selfieCapture, setSelfieCapture] = useState<string | null>(null);
  const [documentCapture, setDocumentCapture] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
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
        stopCamera();
        setStep(2);
        onProgressUpdate(40);
        setIsCapturing(false);
      }
    }
  };
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocumentCapture(event.target?.result as string);
        setStep(3);
        onProgressUpdate(70);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const simulateVerification = () => {
    setIsCapturing(true);
    
    // Simulate a multi-step verification process
    const totalSteps = 5;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.floor(70 + (currentStep / totalSteps) * 30);
      onProgressUpdate(progress);
      
      const messages = [
        "Analyzing selfie...",
        "Authenticating document...",
        "Comparing facial biometrics...",
        "Verifying document integrity...",
        "Finalizing verification..."
      ];
      
      if (currentStep <= totalSteps) {
        toast.info(messages[currentStep - 1]);
      }
      
      if (currentStep === totalSteps) {
        clearInterval(interval);
        setIsCapturing(false);
        
        // Generate a fake verification ID that looks realistic
        const verificationId = `VID-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().substring(6)}`;
        
        // Call the completion callback with the captures
        onVerificationComplete(true, verificationId, selfieCapture || undefined, documentCapture || undefined);
      }
    }, 1200);
  };

  const resetVerification = () => {
    setSelfieCapture(null);
    setDocumentCapture(null);
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
            <h3 className="text-lg font-medium mb-2">Step 1: Take a Selfie</h3>
            <p className="text-sm text-muted-foreground">Please take a clear selfie for facial verification</p>
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
                  disabled={isProcessing || isCapturing}
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
            <p className="text-sm text-muted-foreground">Your documents have been captured. Click below to complete verification.</p>
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
            {isCapturing ? "Verifying..." : "Complete Verification"}
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
