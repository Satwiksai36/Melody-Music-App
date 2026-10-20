import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track } from '../types';
import { MOCK_TRACKS } from '../data/mockData';
import { storageService } from '../services/storageService';

interface PlayerContextType {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progressPercent: number;
  playbackQueue: Track[];
  queueIndex: number;
  repeatMode: 'off' | 'all' | 'one';
  isShuffled: boolean;
  volume: number;
  isMuted: boolean;
  isFullScreenPlayerOpen: boolean;
  isLyricsOpen: boolean;
  lyricsMode: 'line' | 'word';
  likedTrackIds: string[];
  isMockPlayback: boolean;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (seconds: number) => void;
  seekPercent: (percent: number) => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  playFromQueue: (index: number) => void;
  setFullScreenPlayerOpen: (open: boolean) => void;
  setLyricsOpen: (open: boolean) => void;
  setLyricsMode: (mode: 'line' | 'word') => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playbackQueue, setPlaybackQueue] = useState<Track[]>(MOCK_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const currentTrack = playbackQueue[queueIndex] || MOCK_TRACKS[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(45); // start at interesting point
  const [duration, setDuration] = useState<number>(currentTrack.duration || 222);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullScreenPlayerOpen, setFullScreenPlayerOpen] = useState<boolean>(false);
  const [isLyricsOpen, setLyricsOpen] = useState<boolean>(false);
  const [lyricsMode, setLyricsMode] = useState<'line' | 'word'>('word');
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() =>
    storageService.getLikedTrackIds()
  );
  const isMockPlayback = true; // Clearly identified mock playback adapter for sample audio

  // Dynamic progress ticker
  const tickerRef = useRef<number | null>(null);

  useEffect(() => {
    setDuration(currentTrack.duration || 220);
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying) {
      tickerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (repeatMode === 'one') {
              return 0;
            } else {
              nextTrack();
              return 0;
            }
          }
          return prev + 0.5;
        });
      }, 500);
    } else {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
      }
    }
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [isPlaying, duration, repeatMode, queueIndex, playbackQueue.length]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    storageService.addRecentlyPlayed(track);
    if (newQueue) {
      setPlaybackQueue(newQueue);
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      const idx = playbackQueue.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        setQueueIndex(idx);
      } else {
        const updated = [...playbackQueue, track];
        setPlaybackQueue(updated);
        setQueueIndex(updated.length - 1);
      }
    }
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const addToQueue = (track: Track) => {
    setPlaybackQueue((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const removeFromQueue = (trackId: string) => {
    setPlaybackQueue((prev) => {
      if (prev.length <= 1) return prev; // Keep at least one track
      const filtered = prev.filter((t) => t.id !== trackId);
      return filtered;
    });
  };

  const playFromQueue = (index: number) => {
    if (index >= 0 && index < playbackQueue.length) {
      setQueueIndex(index);
      setCurrentTime(0);
      setIsPlaying(true);
      storageService.addRecentlyPlayed(playbackQueue[index]);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextTrack = () => {
    if (playbackQueue.length === 0) return;
    const nextIdx = (queueIndex + 1) % playbackQueue.length;
    setQueueIndex(nextIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    storageService.addRecentlyPlayed(playbackQueue[nextIdx]);
  };

  const prevTrack = () => {
    if (playbackQueue.length === 0) return;
    if (currentTime > 4) {
      setCurrentTime(0);
      return;
    }
    const prevIdx = (queueIndex - 1 + playbackQueue.length) % playbackQueue.length;
    setQueueIndex(prevIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    storageService.addRecentlyPlayed(playbackQueue[prevIdx]);
  };

  const seekTo = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clamped);
  };

  const seekPercent = (percent: number) => {
    const clampedPct = Math.max(0, Math.min(percent, 100));
    const targetSec = (clampedPct / 100) * duration;
    seekTo(targetSec);
  };

  const toggleLike = (trackId: string) => {
    const updated = storageService.toggleLikeTrack(trackId);
    setLikedTrackIds(updated);
  };

  const isLiked = (trackId: string) => likedTrackIds.includes(trackId);

  const toggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  };

  const setVolume = (vol: number) => {
    setVolumeState(Math.max(0, Math.min(1, vol)));
    if (vol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        progressPercent,
        playbackQueue,
        queueIndex,
        repeatMode,
        isShuffled,
        volume,
        isMuted,
        isFullScreenPlayerOpen,
        isLyricsOpen,
        lyricsMode,
        likedTrackIds,
        isMockPlayback,
        playTrack,
        togglePlayPause,
        nextTrack,
        prevTrack,
        seekTo,
        seekPercent,
        toggleLike,
        isLiked,
        toggleShuffle,
        cycleRepeatMode,
        addToQueue,
        removeFromQueue,
        playFromQueue,
        setFullScreenPlayerOpen,
        setLyricsOpen,
        setLyricsMode,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
