/**
 * Storage Service Abstraction for Melody Music Streaming App
 * Provides safe typed access to persistent storage.
 * Designed to be easily swapped with an API/backend in Phase 3.
 */

import { Track, Playlist, Artist } from '../types';
import { MOCK_PLAYLISTS, MOCK_TRACKS } from '../data/mockData';

export interface UserPreferences {
  audioQuality: 'lossless-24bit' | 'hi-res-lossless' | 'high-320kbps' | 'standard';
  dolbyAtmos: boolean;
  normalizeVolume: boolean;
  crossfadeSeconds: number;
  offlineDownloads: boolean;
  downloadQuality: 'lossless' | 'high';
  cellularStreaming: boolean;
  equalizerPreset: 'Electronic' | 'Acoustic' | 'Bass Boost' | 'Vocal' | 'Flat';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  tier: string;
  isLoggedIn: boolean;
  joinedDate: string;
}

const STORAGE_KEYS = {
  LIKED_TRACKS: 'melody_liked_tracks',
  FOLLOWED_ARTISTS: 'melody_followed_artists',
  PLAYLISTS: 'melody_user_playlists',
  PREFERENCES: 'melody_user_preferences',
  PROFILE: 'melody_user_profile',
  RECENTLY_PLAYED: 'melody_recently_played',
  SELECTED_LANGUAGES: 'melody_selected_languages',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  audioQuality: 'lossless-24bit',
  dolbyAtmos: true,
  normalizeVolume: true,
  crossfadeSeconds: 4,
  offlineDownloads: true,
  downloadQuality: 'lossless',
  cellularStreaming: true,
  equalizerPreset: 'Electronic',
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-ananya-sharma',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCRqS3qnQM5TbuqkL-P8_DiCnVXHXj3zMndoTzztD80V9GvZGSFXyHg5dOp0tzLlVagK_rs7PcrvURmclXBFOfNt_bXWlcsw9TVsHWd5nSI7tMzMMk6zE8SVzo_WYyKHif98280rTf_JwqEyWAzvRFDgUxLA0N9rrzxjIi0O-t2CgOrIHcPJNuxO6tzc7PINQeMnR9SpOMs7DdU_77pBlA15-K14QAlLePN6ZvtkBmPkNu-w5vnCiKm4w',
  tier: 'HiFi Lossless Family Master',
  isLoggedIn: true,
  joinedDate: 'Member since Oct 2023',
};

class StorageService {
  private safeGet<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[StorageService] Failed to read ${key}:`, e);
      return defaultValue;
    }
  }

  private safeSet<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[StorageService] Failed to write ${key}:`, e);
    }
  }

  // Liked Tracks
  getLikedTrackIds(): string[] {
    return this.safeGet<string[]>(STORAGE_KEYS.LIKED_TRACKS, ['samaja', 'pushpa-pushpa']);
  }

  setLikedTrackIds(ids: string[]): void {
    this.safeSet(STORAGE_KEYS.LIKED_TRACKS, ids);
  }

  toggleLikeTrack(trackId: string): string[] {
    const current = this.getLikedTrackIds();
    const updated = current.includes(trackId)
      ? current.filter((id) => id !== trackId)
      : [...current, trackId];
    this.setLikedTrackIds(updated);
    return updated;
  }

  // Followed Artists
  getFollowedArtistIds(): string[] {
    return this.safeGet<string[]>(STORAGE_KEYS.FOLLOWED_ARTISTS, [
      'sid-sriram',
      'arijit-singh',
      'dsp',
    ]);
  }

  toggleFollowArtist(artistId: string): string[] {
    const current = this.getFollowedArtistIds();
    const updated = current.includes(artistId)
      ? current.filter((id) => id !== artistId)
      : [...current, artistId];
    this.safeSet(STORAGE_KEYS.FOLLOWED_ARTISTS, updated);
    return updated;
  }

  // Playlists
  getPlaylists(): Playlist[] {
    return this.safeGet<Playlist[]>(STORAGE_KEYS.PLAYLISTS, MOCK_PLAYLISTS);
  }

  savePlaylists(playlists: Playlist[]): void {
    this.safeSet(STORAGE_KEYS.PLAYLISTS, playlists);
  }

  createPlaylist(title: string, description: string = 'User Playlist'): Playlist {
    const current = this.getPlaylists();
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title,
      description,
      coverUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBLH1C8lxmTe3GaxO1lXA1aTrstiFvFZoczJ2kOP0CaxHtVdc7YZTqqXYMnvefk9AyclcWLDbG180u64XTKuOQR_yG_aIxnt3wru2Jkxg5Cv01nDx9NNq0FH4pgqB1voXe3QbtJ7iWH6OAFfAT1fSEifrnyBOsxe7ZW5-LUO4S8dSugwYxEJYlloGVt6aqP6PKNvajaZ4Dv4fUFonB_fizyQsXlltzOb5gxPgaGUmG8JORye-mTK7gCGw',
      trackCount: 0,
      durationText: '0 mins',
      tracks: [],
    };
    const updated = [newPlaylist, ...current];
    this.savePlaylists(updated);
    return newPlaylist;
  }

  renamePlaylist(playlistId: string, newTitle: string): Playlist[] {
    const playlists = this.getPlaylists().map((p) =>
      p.id === playlistId ? { ...p, title: newTitle } : p
    );
    this.savePlaylists(playlists);
    return playlists;
  }

  deletePlaylist(playlistId: string): Playlist[] {
    const playlists = this.getPlaylists().filter((p) => p.id !== playlistId);
    this.savePlaylists(playlists);
    return playlists;
  }

  addTrackToPlaylist(playlistId: string, track: Track): Playlist[] {
    const playlists = this.getPlaylists().map((p) => {
      if (p.id !== playlistId) return p;
      if (p.tracks.some((t) => t.id === track.id)) return p; // already added
      const newTracks = [...p.tracks, track];
      const totalSecs = newTracks.reduce((acc, t) => acc + (t.duration || 200), 0);
      const mins = Math.floor(totalSecs / 60);
      return {
        ...p,
        tracks: newTracks,
        trackCount: newTracks.length,
        durationText: `${mins} mins`,
      };
    });
    this.savePlaylists(playlists);
    return playlists;
  }

  removeTrackFromPlaylist(playlistId: string, trackId: string): Playlist[] {
    const playlists = this.getPlaylists().map((p) => {
      if (p.id !== playlistId) return p;
      const newTracks = p.tracks.filter((t) => t.id !== trackId);
      const totalSecs = newTracks.reduce((acc, t) => acc + (t.duration || 200), 0);
      const mins = Math.floor(totalSecs / 60);
      return {
        ...p,
        tracks: newTracks,
        trackCount: newTracks.length,
        durationText: `${mins} mins`,
      };
    });
    this.savePlaylists(playlists);
    return playlists;
  }

  // Preferences
  getPreferences(): UserPreferences {
    return this.safeGet<UserPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
  }

  updatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    this.safeSet(STORAGE_KEYS.PREFERENCES, updated);
    return updated;
  }

  // User Profile
  getUserProfile(): UserProfile {
    return this.safeGet<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    this.safeSet(STORAGE_KEYS.PROFILE, updated);
    return updated;
  }

  // Recently Played
  getRecentlyPlayed(): Track[] {
    return this.safeGet<Track[]>(STORAGE_KEYS.RECENTLY_PLAYED, [
      MOCK_TRACKS[0], // Samajavaragamana
      MOCK_TRACKS[1], // Pushpa Pushpa
      MOCK_TRACKS[3], // Kurchi Madathapetti
    ]);
  }

  addRecentlyPlayed(track: Track): Track[] {
    const current = this.getRecentlyPlayed().filter((t) => t.id !== track.id);
    const updated = [track, ...current].slice(0, 15);
    this.safeSet(STORAGE_KEYS.RECENTLY_PLAYED, updated);
    return updated;
  }

  // Selected Languages
  getSelectedLanguages(): string[] {
    return this.safeGet<string[]>(STORAGE_KEYS.SELECTED_LANGUAGES, [
      'telugu',
      'hindi',
      'tamil',
    ]);
  }

  setSelectedLanguages(languages: string[]): void {
    this.safeSet(STORAGE_KEYS.SELECTED_LANGUAGES, languages);
  }

  // Cache calculation & cleanup
  getStorageUsageMB(): number {
    try {
      let totalLength = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalLength += (localStorage.getItem(key) || '').length;
        }
      }
      // Simulate realistic media cache size for the 4.2 GB UI meter
      return 4.2;
    } catch {
      return 4.2;
    }
  }

  clearAppCache(): void {
    try {
      // Clear playback cache items without wiping core profile
      localStorage.removeItem(STORAGE_KEYS.RECENTLY_PLAYED);
    } catch (e) {
      console.warn('Failed to clear cache:', e);
    }
  }
}

export const storageService = new StorageService();
