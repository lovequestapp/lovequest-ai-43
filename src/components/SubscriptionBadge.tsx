
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { convertPremiumStatus } from '@/utils/subscription';

interface SubscriptionBadgeProps {
  status?: string;
  className?: string;
}

const SubscriptionBadge = ({ status = 'standard', className = '' }: SubscriptionBadgeProps) => {
  // Convert any legacy status values to new format
  const normalizedStatus = convertPremiumStatus(status);
  
  switch(normalizedStatus) {
    case 'vip':
      return (
        <Badge className={`bg-gradient-to-r from-amber-500 to-amber-600 text-white ${className}`}>
          VIP
        </Badge>
      );
    case 'unlimited':
      return (
        <Badge className={`bg-gradient-to-r from-indigo-500 to-purple-500 text-white ${className}`}>
          Unlimited
        </Badge>
      );
    case 'admin':
      return (
        <Badge className={`bg-gradient-to-r from-red-500 to-rose-500 text-white ${className}`}>
          Admin
        </Badge>
      );
    default:
      return (
        <Badge className={`bg-gradient-to-r from-gray-400 to-gray-500 text-white ${className}`}>
          Standard
        </Badge>
      );
  }
};

export default SubscriptionBadge;
