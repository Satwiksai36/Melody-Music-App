import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Track } from '../types';
import { MOCK_TRACKS } from '../data/mockData';
import { storageService } from '../services/storageService';
import {
  spotifyAuth,
  spotifyPlayer,
  resolveTrackOnSpotify,
  getSpotifyTrackId,
} from '../services/spotify';
import type { MusicAuthUser, PlaybackStatus } from '../services/spotify';

// â”€â”€â”€ Context Type â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  // â”€â”€ Spotify â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  /** 'disconnected' | 'connecting' | 'connected' | 'error' */
  spotifyStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  /** Current Spotify user (null when disconnected) */
  spotifyUser: MusicAuthUser | null;
  /** True when Spotify SDK is ready and Premium was confirmed */
  isSpotifyPremium: boolean;
  /** Current SDK/preview playback status string */
  playbackStatus: PlaybackStatus;
  /** True when only 30-second previews are playing (non-Premium) */
  isPreviewMode: boolean;
  /** Last playback error message, if any */
  playbackError: string | null;
  connectSpotify: () => Promise<void>;
  disconnectSpotify: () => void;
  // â”€â”€ Playback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // â”€â”€ Track / Queue â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [playbackQueue, setPlaybackQueue] = useState<Track[]>(MOCK_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const currentTrack = playbackQueue[queueIndex] || MOCK_TRACKS[0];

  // â”€â”€ Playback State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(45);
  const [duration, setDuration] = useState<number>(currentTrack.duration || 222);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // â”€â”€ UI State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [isFullScreenPlayerOpen, setFullScreenPlayerOpen] = useState<boolean>(false);
  const [isLyricsOpen, setLyricsOpen] = useState<boolean>(false);
  const [lyricsMode, setLyricsMode] = useState<'line' | 'word'>('word');
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() =>
    storageService.getLikedTrackIds()
  );

  // â”€â”€ Spotify State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [spotifyStatus, setSpotifyStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>(
    () => (spotifyAuth.loadTokens() ? 'connected' : 'disconnected')
  );
  const [spotifyUser, setSpotifyUser] = useState<MusicAuthUser | null>(() => spotifyAuth.loadUser());
  const [isSpotifyPremium, setIsSpotifyPremium] = useState<boolean>(
    () => spotifyAuth.loadUser()?.isPremium ?? false
  );
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  // â”€â”€ Refs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const tickerRef = useRef<number | null>(null);
  const spotifyInitialized = useRef<boolean>(false);

  // â”€â”€â”€ Mock Progress Ticker (used when Spotify is disconnected) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const startMockTicker = useCallback(() => {
    if (tickerRef.current) clearInterval(tickerRef.current);
    tickerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          // handled by nextTrack auto-advance via effect
          return 0;
        }
        return prev + 0.5;
      });
    }, 500);
  }, [duration]);

  const stopMockTicker = useCallback(() => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  // â”€â”€ Sync duration when track changes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    setDuration(currentTrack.duration || 220);
  }, [currentTrack]);

  // â”€â”€ Mock ticker when Spotify is disconnected â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (spotifyStatus === 'connected') return; // Spotify handles progress
    if (isPlaying) {
      startMockTicker();
    } else {
      stopMockTicker();
    }
    return () => stopMockTicker();
  }, [isPlaying, duration, repeatMode, spotifyStatus, startMockTicker, stopMockTicker]);

  // â”€â”€ Spotify player status listener â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const unsubStatus = spotifyPlayer.onStatusChange((status) => {
      setPlaybackStatus(status);
      if (status === 'playing') setIsPlaying(true);
      if (status === 'paused') setIsPlaying(false);
      if (status === 'preview') {
        setIsPreviewMode(true);
        setIsPlaying(true);
      }
      if (status === 'error') {
        setPlaybackError('Playback failed. Check your Spotify connection.');
        setIsPlaying(false);
      }
      if (status === 'unavailable') {
        setPlaybackError('Track unavailable in your region or requires Spotify Premium.');
        setIsPlaying(false);
      }
    });

    const unsubPosition = spotifyPlayer.onPositionChange((pos) => {
      setCurrentTime(pos.positionMs / 1000);
      setDuration(pos.durationMs / 1000);
    });

    return () => {
      unsubStatus();
      unsubPosition();
    };
  }, []);

  // â”€â”€ Re-init Spotify when tokens are already present on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (spotifyInitialized.current) return;
    if (spotifyStatus !== 'connected') return;

    spotifyInitialized.current = true;
    spotifyAuth.getValidToken().then(async (token) => {
      if (!token) { setSpotifyStatus('disconnected'); return; }
      const user = spotifyAuth.loadUser();
      if (!user) {
        try {
          const freshUser = await spotifyAuth.fetchUser(token);
          setSpotifyUser(freshUser);
          setIsSpotifyPremium(freshUser.isPremium);
        } catch { /* silent */ }
      } else {
        setSpotifyUser(user);
        setIsSpotifyPremium(user.isPremium);
      }
      const premium = await spotifyPlayer.initialize(token);
      setIsSpotifyPremium(premium);
    });
  }, [spotifyStatus]);

  // â”€â”€â”€ Spotify Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const connectSpotify = async () => {
    try {
      setSpotifyStatus('connecting');
      await spotifyAuth.initiateLogin();
      // Page will redirect â€” state continues after callback handling
    } catch (err: unknown) {
      setSpotifyStatus('error');
      const msg = err instanceof Error ? err.message : 'Failed to connect Spotify';
      setPlaybackError(msg);
    }
  };

  const disconnectSpotify = () => {
    spotifyPlayer.destroy();
    spotifyAuth.clearAuth();
    setSpotifyStatus('disconnected');
    setSpotifyUser(null);
    setIsSpotifyPremium(false);
    setIsPreviewMode(false);
    setPlaybackStatus('idle');
    setPlaybackError(null);
    spotifyInitialized.current = false;
  };

  // â”€â”€â”€ Track Resolution & Playback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Resolves a Melody-internal track to a Spotify track and starts playback.
   * Falls back to preview if full-track unavailable.
   * Does not expose Spotify internals to the caller.
   */
  const resolveAndPlay = async (track: Track) => {
    setPlaybackError(null);
    try {
      let spotifyId = getSpotifyTrackId(track.id);

      if (!spotifyId) {
        // Track is from catalog - resolve it on Spotify by title + artist
        const result = await resolveTrackOnSpotify(track.title, track.artist);
        if (result) {
          if (!result.isPlayable && !result.previewUrl && !isSpotifyPremium) {
            setPlaybackStatus('unavailable');
            setPlaybackError(`"${track.title}" is unavailable on this Spotify account.`);
            setIsPlaying(false);
            return;
          }
          await spotifyPlayer.play(result);
        } else {
          setPlaybackStatus('unavailable');
          setPlaybackError(`"${track.title}" was not found on Spotify.`);
          setIsPlaying(false);
        }
      } else {
        // Track already has a Spotify ID
        const musicTrack = {
          providerId: spotifyId,
          provider: 'spotify' as const,
          title: track.title,
          artist: track.artist,
          album: track.movieOrAlbum ?? '',
          artworkUrl: track.coverUrl,
          durationMs: track.duration * 1000,
          previewUrl: track.audioUrl ?? null,
          isPlayable: isSpotifyPremium,
          externalUrl: '',
        };
        await spotifyPlayer.play(musicTrack);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Playback error';
      setPlaybackStatus('error');
      setPlaybackError(msg);
      setIsPlaying(false);
    }
  };

  // â”€â”€â”€ Queue & Track Controls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    setIsPreviewMode(false);

    if (spotifyStatus === 'connected') {
      resolveAndPlay(track);
    } else {
      setIsPlaying(true);
    }
  };

  const addToQueue = (track: Track) => {
    setPlaybackQueue((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const removeFromQueue = (trackId: string) => {
    setPlaybackQueue((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((t) => t.id !== trackId);
    });
  };

  const playFromQueue = (index: number) => {
    if (index >= 0 && index < playbackQueue.length) {
      setQueueIndex(index);
      setCurrentTime(0);
      setIsPlaying(true);
      storageService.addRecentlyPlayed(playbackQueue[index]);
      if (spotifyStatus === 'connected') {
        resolveAndPlay(playbackQueue[index]);
      }
    }
  };

  const togglePlayPause = () => {
    if (spotifyStatus === 'connected') {
      if (isPlaying) {
        spotifyPlayer.pause();
      } else {
        spotifyPlayer.resume();
      }
    }
    setIsPlaying((prev) => !prev);
  };

  const nextTrack = () => {
    if (playbackQueue.length === 0) return;
    const nextIdx = (queueIndex + 1) % playbackQueue.length;
    setQueueIndex(nextIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    storageService.addRecentlyPlayed(playbackQueue[nextIdx]);
    if (spotifyStatus === 'connected') {
      resolveAndPlay(playbackQueue[nextIdx]);
    }
  };

  const prevTrack = () => {
    if (playbackQueue.length === 0) return;
    if (currentTime > 4) {
      setCurrentTime(0);
      if (spotifyStatus === 'connected') spotifyPlayer.seek(0);
      return;
    }
    const prevIdx = (queueIndex - 1 + playbackQueue.length) % playbackQueue.length;
    setQueueIndex(prevIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    storageService.addRecentlyPlayed(playbackQueue[prevIdx]);
    if (spotifyStatus === 'connected') {
      resolveAndPlay(playbackQueue[prevIdx]);
    }
  };

  const seekTo = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clamped);
    if (spotifyStatus === 'connected') {
      spotifyPlayer.seek(clamped * 1000);
    }
  };

  const seekPercent = (percent: number) => {
    seekTo((Math.max(0, Math.min(percent, 100)) / 100) * duration);
  };

  const toggleLike = (trackId: string) => {
    const updated = storageService.toggleLikeTrack(trackId);
    setLikedTrackIds(updated);
  };

  const isLiked = (trackId: string) => likedTrackIds.includes(trackId);
  const toggleShuffle = () => setIsShuffled((prev) => !prev);
  const cycleRepeatMode = () =>
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (vol > 0 && isMuted) setIsMuted(false);
    spotifyPlayer.setVolume(clamped * 100);
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  // ─── MediaSession API (Android Notification & Lock Screen Controls) ────────
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.movieOrAlbum || 'Melody Music',
        artwork: [
          { src: currentTrack.coverUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        if (!isPlaying) togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (isPlaying) togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        prevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextTrack();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          seekTo(details.seekTime);
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        seekTo(Math.max(0, currentTime - (details.seekOffset || 10)));
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        seekTo(Math.min(duration, currentTime + (details.seekOffset || 10)));
      });
    } catch {
      // Ignore unsupported browser handlers
    }
  }, [currentTrack, isPlaying, currentTime, duration]);

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
        spotifyStatus,
        spotifyUser,
        isSpotifyPremium,
        playbackStatus,
        isPreviewMode,
        playbackError,
        connectSpotify,
        disconnectSpotify,
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
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};

