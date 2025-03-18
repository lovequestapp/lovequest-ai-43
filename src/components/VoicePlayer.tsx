
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

interface VoicePlayerProps {
  audioUrl: string;
  className?: string;
  compact?: boolean;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl, className, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    // Initialize volume
    audio.volume = volume;

    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle mute toggle
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const volumeValue = newVolume[0];
    audio.volume = volumeValue;
    setVolume(volumeValue);
    
    if (volumeValue === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Handle seeking
  const handleSeek = (newTime: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newTime[0];
    setCurrentTime(newTime[0]);
  };

  // Format time display
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "flex flex-col gap-2 p-3 rounded-lg bg-gray-50 shadow-sm border border-gray-100",
      compact ? "w-full max-w-xs" : "w-full max-w-md",
      className
    )}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center gap-3">
        <Button
          onClick={togglePlay}
          size="icon"
          variant="outline"
          className="h-9 w-9 rounded-full border-love-200 bg-white hover:bg-love-50 hover:border-love-300 transition-all duration-300"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-love-500" />
          ) : (
            <Play className="h-4 w-4 text-love-500 ml-0.5" />
          )}
        </Button>
        
        <div className="flex-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {!compact && !isMobile && (
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleMute}
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-gray-100 transition-all duration-300"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-gray-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-gray-500" />
              )}
            </Button>
            
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20 cursor-pointer"
            />
          </div>
        )}
      </div>
      
      {/* Add loading/buffering indicator for better UX */}
      {duration === 0 && (
        <div className="flex justify-center items-center py-1">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 h-1.5 rounded-full bg-love-300 animate-pulse" 
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoicePlayer;
