
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModerationContextProps {
  blockedProfiles: Set<string>;
  reportedProfiles: Set<string>;
  blockProfile: (profileId: string) => void;
  unblockProfile: (profileId: string) => void;
  reportProfile: (profileId: string, reason: string) => void;
}

const ModerationContext = createContext<ModerationContextProps | undefined>(undefined);

export const useModeration = (): ModerationContextProps => {
  const context = useContext(ModerationContext);
  if (!context) {
    throw new Error('useModeration must be used within a ModerationProvider');
  }
  return context;
};

export const ModerationProvider = ({ children }: { children: ReactNode }) => {
  const [blockedProfiles, setBlockedProfiles] = useState<Set<string>>(new Set());
  const [reportedProfiles, setReportedProfiles] = useState<Set<string>>(new Set());

  const blockProfile = (profileId: string) => {
    setBlockedProfiles(prev => new Set(prev).add(profileId));
  };

  const unblockProfile = (profileId: string) => {
    setBlockedProfiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(profileId);
      return newSet;
    });
  };

  const reportProfile = (profileId: string, reason: string) => {
    console.log(`Reporting profile ${profileId} for reason: ${reason}`);
    setReportedProfiles(prev => new Set(prev).add(profileId));
    // Extend with backend calls here for moderation
  };

  return (
    <ModerationContext.Provider
      value={{ blockedProfiles, reportedProfiles, blockProfile, unblockProfile, reportProfile }}
    >
      {children}
    </ModerationContext.Provider>
  );
};
