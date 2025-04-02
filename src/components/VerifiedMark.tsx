
import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, ShieldX, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VerifiedMarkProps {
  status: 'verified' | 'unverified' | 'pending' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const VerifiedMark: React.FC<VerifiedMarkProps> = ({ 
  status, 
  size = 'sm',
  showTooltip = true
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const renderIcon = () => {
    switch (status) {
      case 'verified':
        return <ShieldCheck className={`${sizeClasses[size]} text-green-500`} />;
      case 'pending':
        return <Shield className={`${sizeClasses[size]} text-amber-500`} />;
      case 'rejected':
        return <ShieldX className={`${sizeClasses[size]} text-red-500`} />;
      case 'unverified':
      default:
        return <ShieldAlert className={`${sizeClasses[size]} text-gray-400`} />;
    }
  };
  
  const getTooltipText = () => {
    switch (status) {
      case 'verified':
        return 'Verified Account';
      case 'pending':
        return 'Verification Pending';
      case 'rejected':
        return 'Verification Rejected';
      case 'unverified':
      default:
        return 'Unverified Account';
    }
  };
  
  const Container = ({ children }: { children: React.ReactNode }) => {
    const padding = size === 'sm' ? 'p-1' : 'p-1.5';
    
    return (
      <span className={`inline-flex items-center justify-center rounded-full ${
        status === 'verified' ? 'bg-green-100' : 
        status === 'pending' ? 'bg-amber-100' : 
        status === 'rejected' ? 'bg-red-100' : 
        'bg-gray-100'
      } ${padding}`}>
        {children}
      </span>
    );
  };
  
  if (!showTooltip) {
    return <Container>{renderIcon()}</Container>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Container>{renderIcon()}</Container>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerifiedMark;
