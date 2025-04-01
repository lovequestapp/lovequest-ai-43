
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProfileSetupProgressProps {
  step: number;
  totalSteps: number;
}

const ProfileSetupProgress: React.FC<ProfileSetupProgressProps> = ({ step, totalSteps }) => {
  const percent = (step / totalSteps) * 100;
  
  return (
    <div className="w-full mb-6">
      <Progress value={percent} className="h-2" />
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>Step {step} of {totalSteps}</span>
        <span>{Math.round(percent)}% Complete</span>
      </div>
    </div>
  );
};

export default ProfileSetupProgress;
