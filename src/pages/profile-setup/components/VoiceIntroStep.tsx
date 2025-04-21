
import React from 'react';
import VoiceIntroSection from '@/components/profile-setup/VoiceIntroSection';

interface VoiceIntroStepProps {
  profileData: any;
  voiceNote: string | null;
  isRecording: boolean;
  toggleRecording: () => void;
  onVoiceRecordingComplete: (audioUrl: string) => void;
  onDeleteVoiceNote: () => void;
}

const VoiceIntroStep: React.FC<VoiceIntroStepProps> = ({
  profileData,
  voiceNote,
  isRecording,
  toggleRecording,
  onVoiceRecordingComplete,
  onDeleteVoiceNote,
}) => {
  return (
    <VoiceIntroSection
      profileData={profileData}
      voiceNote={voiceNote}
      isRecording={isRecording}
      toggleRecording={toggleRecording}
      onVoiceRecordingComplete={onVoiceRecordingComplete}
      onDeleteVoiceNote={onDeleteVoiceNote}
    />
  );
};

export default VoiceIntroStep;

