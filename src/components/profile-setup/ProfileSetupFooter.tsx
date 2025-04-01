
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProfileSetupFooterProps {
  step: number;
  totalSteps: number;
  isSubmitting: boolean;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  handleSubmit: () => void;
}

const ProfileSetupFooter: React.FC<ProfileSetupFooterProps> = ({
  step,
  totalSteps,
  isSubmitting,
  handlePrevStep,
  handleNextStep,
  handleSubmit
}) => {
  return (
    <div className="flex justify-between">
      {step > 1 && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handlePrevStep}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Back
        </Button>
      )}
      
      {step < totalSteps ? (
        <Button 
          type="button" 
          className={`${step === 1 && 'w-full'} ${step > 1 ? 'ml-auto' : ''}`}
          onClick={handleNextStep}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </Button>
      ) : (
        <Button 
          type="button"
          onClick={handleSubmit}
          className="ml-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving Profile..." : "Complete Setup"}
        </Button>
      )}
    </div>
  );
};

export default ProfileSetupFooter;
