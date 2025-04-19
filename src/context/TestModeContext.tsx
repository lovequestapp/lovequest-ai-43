
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/user';
import demoUsers from '../data/demoUsers';

// Define the context shape
interface TestModeContextType {
  isTestMode: boolean;
  setTestMode: (value: boolean) => void;
  toggleTestMode: () => void; // Added this property
  getDemoUser: (id: string) => User | undefined;
  getAllDemoUsers: () => User[];
  demoProfiles: User[]; // Added this property
  saveDemoSettings: (settings: any) => void; // Added this property
}

// Create the context with default values
const TestModeContext = createContext<TestModeContextType>({
  isTestMode: false,
  setTestMode: () => {},
  toggleTestMode: () => {}, // Added default implementation
  getDemoUser: () => undefined,
  getAllDemoUsers: () => [],
  demoProfiles: [], // Added empty array as default
  saveDemoSettings: () => {}, // Added default implementation
});

// Provider component
interface TestModeProviderProps {
  children: ReactNode;
}

export const TestModeProvider = ({ children }: TestModeProviderProps) => {
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [appSettings, setAppSettings] = useState<any>(null);

  const getDemoUser = (id: string) => {
    return demoUsers.find(user => user.id === id);
  };

  const getAllDemoUsers = () => {
    return demoUsers;
  };

  const setTestMode = (value: boolean) => {
    setIsTestMode(value);
    // Could add more logic here like loading demo data, etc.
  };

  const toggleTestMode = () => {
    setIsTestMode(prevMode => !prevMode);
  };

  const saveDemoSettings = (settings: any) => {
    setAppSettings(settings);
    console.log('Demo settings saved:', settings);
  };

  return (
    <TestModeContext.Provider 
      value={{ 
        isTestMode, 
        setTestMode,
        toggleTestMode,
        getDemoUser,
        getAllDemoUsers,
        demoProfiles: demoUsers,
        saveDemoSettings
      }}
    >
      {children}
    </TestModeContext.Provider>
  );
};

// Custom hook for using the context
export const useTestMode = () => useContext(TestModeContext);
