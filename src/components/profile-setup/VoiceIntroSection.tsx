
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, User } from 'lucide-react';
import VoiceRecorder from '@/components/VoiceRecorder';

interface VoiceIntroSectionProps {
  profileData: {
    name: string;
    age: number;
    location: string;
    gender: string;
    interestedIn: string[];
    bio: string;
    personalityTraits: string[];
  };
  voiceNote: string | null;
  isRecording: boolean;
  toggleRecording: () => void;
  onVoiceRecordingComplete: (audioUrl: string) => void;
  onDeleteVoiceNote: () => void;
}

const VoiceIntroSection: React.FC<VoiceIntroSectionProps> = ({
  profileData,
  voiceNote,
  isRecording,
  toggleRecording,
  onVoiceRecordingComplete,
  onDeleteVoiceNote
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Voice Introduction</h3>
      <p className="text-sm text-muted-foreground">Add a voice note to let others hear your voice (optional)</p>
      
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md">
        <VoiceRecorder 
          onRecordingComplete={onVoiceRecordingComplete}
          initialAudio={voiceNote || undefined}
          onDelete={onDeleteVoiceNote}
        />
      </div>
      
      <div className="bg-love-50 p-4 rounded-md mt-6">
        <h4 className="text-base font-medium text-love-700 mb-2 flex items-center">
          <User size={18} className="mr-2" />
          Profile Preview
        </h4>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Name:</span> {profileData.name}, {profileData.age}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Location:</span> {profileData.location}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Gender:</span> {profileData.gender || 'Not specified'} 
          <span className="mx-2">•</span>
          <span className="font-medium">Interested in:</span> {profileData.interestedIn.length > 0 ? profileData.interestedIn.join(', ') : 'Not specified'}
        </p>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Personality:</span> 
          <div className="flex flex-wrap gap-1 mt-1">
            {profileData.personalityTraits.map(trait => (
              <span key={trait} className="inline-block px-2 py-1 bg-love-100 text-love-700 rounded-full text-xs">
                {trait}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          <span className="font-medium">Bio:</span> {profileData.bio}
        </p>
      </div>
    </div>
  );
};

export default VoiceIntroSection;
