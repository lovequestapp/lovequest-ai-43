
import React from 'react';
import { Progress } from "@/components/ui/progress";

export interface ProfileSetupProgressProps {
  currentStep: number;
  totalSteps: number;
}

const ProfileSetupProgress: React.FC<ProfileSetupProgressProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Profile Setup</span>
        <span className="text-sm text-muted-foreground">{currentStep} of {totalSteps}</span>
      </div>
      <Progress value={progress} indicatorClassName="bg-love-500" />
    </div>
  );
};

export default ProfileSetupProgress;
