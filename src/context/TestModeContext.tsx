
import React, { createContext, useContext, useState, useEffect } from 'react';
import { demoUsers } from '../data/demoUsers';
import { User } from '../types/user';
import { useUser } from './UserContext';
import { toast } from 'sonner';

interface TestModeContextType {
  isTestMode: boolean;
  toggleTestMode: () => void;
  demoProfiles: User[];
  saveDemoSettings: (settings: any) => void;
}

const TestModeContext = createContext<TestModeContextType>({
  isTestMode: false,
  toggleTestMode: () => {},
  demoProfiles: [],
  saveDemoSettings: () => {},
});

export const TestModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const { currentUser } = useUser();
  const [demoProfiles, setDemoProfiles] = useState<User[]>([]);
  const [demoSettings, setDemoSettings] = useState({});
  
  // Initialize test mode from localStorage if available
  useEffect(() => {
    const savedTestMode = localStorage.getItem('lovequest_test_mode');
    if (savedTestMode) {
      setIsTestMode(JSON.parse(savedTestMode));
    }
    
    // Load demo settings if they exist
    const savedDemoSettings = localStorage.getItem('lovequest_demo_settings');
    if (savedDemoSettings) {
      setDemoSettings(JSON.parse(savedDemoSettings));
    }
  }, []);

  // Load demo profiles when test mode is enabled
  useEffect(() => {
    if (isTestMode) {
      // Mark demo users so we can identify them in the UI
      const markedDemoUsers = demoUsers.map(user => ({
        ...user,
        isDemo: true // Add this flag to identify demo users
      }));
      setDemoProfiles(markedDemoUsers);
    } else {
      setDemoProfiles([]);
    }
    
    // Save test mode status to localStorage
    localStorage.setItem('lovequest_test_mode', JSON.stringify(isTestMode));
  }, [isTestMode]);

  const toggleTestMode = () => {
    // Only admins can toggle test mode
    if (currentUser?.role !== 'admin') {
      toast.error("Permission denied", {
        description: "Only administrators can toggle test mode."
      });
      return;
    }

    const newMode = !isTestMode;
    setIsTestMode(newMode);
    
    if (newMode) {
      toast.success("Test mode enabled", {
        description: "Demo profiles are now available for testing."
      });
    } else {
      toast.success("Test mode disabled", {
        description: "Switched to live mode - demo profiles are hidden."
      });
    }
  };
  
  const saveDemoSettings = (settings: any) => {
    setDemoSettings(prev => ({...prev, ...settings}));
    localStorage.setItem('lovequest_demo_settings', JSON.stringify({...demoSettings, ...settings}));
    toast.success("Demo settings saved", {
      description: "Your test environment settings have been updated."
    });
  };

  return (
    <TestModeContext.Provider value={{ isTestMode, toggleTestMode, demoProfiles, saveDemoSettings }}>
      {children}
    </TestModeContext.Provider>
  );
};

export const useTestMode = () => useContext(TestModeContext);
