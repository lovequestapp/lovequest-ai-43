
import React, { createContext, useContext, ReactNode } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

interface ProtectedRouteContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  userSubscription: string | null;
}

const ProtectedRouteContext = createContext<ProtectedRouteContextType>({
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  userSubscription: null
});

export const useProtectedRouteContext = () => useContext(ProtectedRouteContext);

export const ProtectedRouteProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, userRole, userSubscription } = useProtectedRoute({
    requireAuth: false // Only check, don't enforce
  });

  const value = {
    isAuthenticated,
    isLoading,
    userRole,
    userSubscription
  };

  return (
    <ProtectedRouteContext.Provider value={value}>
      {children}
    </ProtectedRouteContext.Provider>
  );
};
