import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAudioPlayer as useExpoAudioPlayer, AudioSource, setAudioModeAsync, useAudioPlayerStatus } from 'expo-audio';
import { ApiRecommendation } from '../models/recommendation';

interface AudioPlayerContextType {
  currentlyPlaying: ApiRecommendation | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playRecommendation: (recommendation: ApiRecommendation) => Promise<void>;
  playPause: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  skip: (seconds: number) => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<ApiRecommendation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayer = useExpoAudioPlayer();
  const audioPlayerStatus = useAudioPlayerStatus(audioPlayer);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set up audio mode
  // await setAudioModeAsync({
  //   playsInSilentMode: true,
  //   shouldPlayInBackground: true,
  //   interruptionModeAndroid: 'duckOthers',
  //   interruptionMode: 'mixWithOthers'
  // });

  // Sync player state with our state
  useEffect(() => {
    setIsPlaying(audioPlayerStatus.playing);
    setCurrentTime(audioPlayerStatus.currentTime); // Convert from ms to seconds
    if (audioPlayerStatus.duration) {
      setDuration(audioPlayerStatus.duration); // Convert from ms to seconds
    }
  }, [audioPlayerStatus.playing, audioPlayerStatus.currentTime, audioPlayerStatus.duration]);

  // Handle playback end
  useEffect(() => {
    if (audioPlayerStatus.playing === false && currentTime > 0 && duration > 0 && currentTime >= duration) {
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [audioPlayerStatus.playing, currentTime, duration]);

  const playRecommendation = async (recommendation: ApiRecommendation) => {
    try {
      // If same recommendation, toggle play/pause
      if (currentlyPlaying?.id === recommendation.id) {
        await playPause();
        return;
      }

      const audioSource: AudioSource = recommendation.audio_clip_url
        ? { uri: recommendation.audio_clip_url }
        : null;

      audioPlayer.replace(audioSource);
      audioPlayer.play();

      setCurrentlyPlaying(recommendation);
      // TODO: duration is not available on ApiRecommendation summary — update once a full detail endpoint provides it
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing recommendation:', error);
      setCurrentlyPlaying(recommendation);
      // TODO: duration is not available on ApiRecommendation summary — update once a full detail endpoint provides it
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const playPause = async () => {
    try {
      if (audioPlayer.isLoaded && currentlyPlaying) {
        if (audioPlayerStatus.playing) {
          audioPlayer.pause();
        } else {
          audioPlayer.play();
        }
      } else if (currentlyPlaying) {
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      // Fallback: toggle state
      setIsPlaying(!isPlaying);
    }
  };

  const seek = async (time: number) => {
    try {
      if (audioPlayer.isLoaded) {
        // expo-audio uses currentTime property directly (in milliseconds)
        audioPlayerStatus.currentTime = time * 1000;
      }
      // Update time for both real and mock playback
      setCurrentTime(Math.max(0, Math.min(duration, time)));
    } catch (error) {
      console.error('Error seeking:', error);
      setCurrentTime(Math.max(0, Math.min(duration, time)));
    }
  };

  const skip = async (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    await seek(newTime);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentlyPlaying,
        isPlaying,
        currentTime,
        duration,
        playRecommendation,
        playPause,
        seek,
        skip,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}

