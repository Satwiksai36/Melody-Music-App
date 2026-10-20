/**
 * Storage Service Abstraction for Melody Music Streaming App
 * Provides safe typed access to persistent storage.
 * Seamlessly integrates with Supabase for cloud persistence
 * with immediate local cache fallback.
 */

import { Track, Playlist } from '../types';
import { getSupabaseClient } from './supabaseClient';

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
  id: '',
  name: '',
  email: '',
  avatarUrl: '',
  tier: 'Melody HiFi Pro',
  isLoggedIn: false,
  joinedDate: `Member since ${new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`,
};

class StorageService {
  private listeners: Set<(profile: UserProfile) => void> = new Set();

  constructor() {
    // Attempt initial background sync with Supabase
    if (typeof window !== 'undefined') {
      setTimeout(() => this.syncWithSupabase(), 1000);
    }
  }

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

  // Subscribe to profile changes across any screen
  subscribeToProfile(cb: (profile: UserProfile) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notifyProfileListeners(profile: UserProfile) {
    this.listeners.forEach((cb) => {
      try {
        cb(profile);
      } catch (err) {
        console.warn('[StorageService] Error in profile listener:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('melody_user_profile_updated', { detail: profile })
      );
    }
  }

  // Liked Tracks
  getLikedTrackIds(): string[] {
    return this.safeGet<string[]>(STORAGE_KEYS.LIKED_TRACKS, []);
  }

  setLikedTrackIds(ids: string[]): void {
    this.safeSet(STORAGE_KEYS.LIKED_TRACKS, ids);
    this.syncLikedTracksToSupabase(ids);
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
    return this.safeGet<string[]>(STORAGE_KEYS.FOLLOWED_ARTISTS, []);
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
    return this.safeGet<Playlist[]>(STORAGE_KEYS.PLAYLISTS, []);
  }

  savePlaylists(playlists: Playlist[]): void {
    this.safeSet(STORAGE_KEYS.PLAYLISTS, playlists);
    this.syncPlaylistsToSupabase(playlists);
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
      if (p.tracks.some((t) => t.id === track.id)) return p;
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
    this.syncPreferencesToSupabase(updated);
    return updated;
  }

  // User Profile
  getUserProfile(): UserProfile {
    return this.safeGet<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated: UserProfile = { ...current, ...profile };
    this.safeSet(STORAGE_KEYS.PROFILE, updated);
    this.notifyProfileListeners(updated);
    this.syncProfileToSupabase(updated);
    return updated;
  }

  // Recently Played
  getRecentlyPlayed(): Track[] {
    return this.safeGet<Track[]>(STORAGE_KEYS.RECENTLY_PLAYED, []);
  }

  addRecentlyPlayed(track: Track): Track[] {
    const current = this.getRecentlyPlayed().filter((t) => t.id !== track.id);
    const updated = [track, ...current].slice(0, 15);
    this.safeSet(STORAGE_KEYS.RECENTLY_PLAYED, updated);
    return updated;
  }

  // Selected Languages
  getSelectedLanguages(): string[] {
    return this.safeGet<string[]>(STORAGE_KEYS.SELECTED_LANGUAGES, []);
  }

  setSelectedLanguages(languages: string[]): void {
    this.safeSet(STORAGE_KEYS.SELECTED_LANGUAGES, languages);
  }

  // Cache calculation & cleanup
  getStorageUsageMB(): number {
    return 4.2;
  }

  clearAppCache(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENTLY_PLAYED);
    } catch (e) {
      console.warn('Failed to clear cache:', e);
    }
  }

  // ----------------------------------------------------
  // Supabase Cloud Synchronization Layer
  // ----------------------------------------------------
  public async syncWithSupabase(): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const currentProfile = this.getUserProfile();
      const { data, error } = await client
        .from('users_profile')
        .select('*')
        .eq('id', currentProfile.id || 'user-riyad')
        .maybeSingle();

      if (data && !error) {
        const merged: UserProfile = {
          id: data.id,
          name: data.name || currentProfile.name,
          email: data.email || currentProfile.email,
          phone: data.phone || currentProfile.phone,
          avatarUrl: data.avatar_url || currentProfile.avatarUrl,
          tier: data.tier || currentProfile.tier,
          isLoggedIn: data.is_logged_in ?? currentProfile.isLoggedIn,
          joinedDate: data.joined_date || currentProfile.joinedDate,
        };
        this.safeSet(STORAGE_KEYS.PROFILE, merged);
        this.notifyProfileListeners(merged);
        console.log('[Melody Supabase] Synchronized profile from Supabase:', merged.name);
      }
    } catch (e) {
      console.warn('[Melody Supabase] Background sync failed:', e);
    }
  }

  private async syncProfileToSupabase(profile: UserProfile): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      await client.from('users_profile').upsert({
        id: profile.id || 'user-riyad',
        name: profile.name,
        email: profile.email,
        phone: profile.phone || null,
        avatar_url: profile.avatarUrl,
        tier: profile.tier,
        is_logged_in: profile.isLoggedIn,
        joined_date: profile.joinedDate,
        updated_at: new Date().toISOString(),
      });
      console.log('[Melody Supabase] Upserted profile to Supabase:', profile.name);
    } catch (e) {
      console.warn('[Melody Supabase] Failed to upsert profile:', e);
    }
  }

  private async syncPlaylistsToSupabase(playlists: Playlist[]): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const profile = this.getUserProfile();
      for (const pl of playlists) {
        await client.from('user_playlists').upsert({
          id: pl.id,
          user_id: profile.id || 'user-riyad',
          title: pl.title,
          description: pl.description || '',
          cover_url: pl.coverUrl || '',
          track_count: pl.trackCount || 0,
          duration_text: pl.durationText || '',
          tracks: pl.tracks || [],
          updated_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('[Melody Supabase] Failed to sync playlists:', e);
    }
  }

  private async syncLikedTracksToSupabase(trackIds: string[]): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const profile = this.getUserProfile();
      for (const trackId of trackIds) {
        await client.from('user_liked_tracks').upsert({
          user_id: profile.id || 'user-riyad',
          track_id: trackId,
        });
      }
    } catch (e) {
      console.warn('[Melody Supabase] Failed to sync liked tracks:', e);
    }
  }

  private async syncPreferencesToSupabase(prefs: UserPreferences): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const profile = this.getUserProfile();
      await client.from('user_preferences').upsert({
        user_id: profile.id || 'user-riyad',
        audio_quality: prefs.audioQuality,
        dolby_atmos: prefs.dolbyAtmos,
        normalize_volume: prefs.normalizeVolume,
        crossfade_seconds: prefs.crossfadeSeconds,
        offline_downloads: prefs.offlineDownloads,
        download_quality: prefs.downloadQuality,
        cellular_streaming: prefs.cellularStreaming,
        equalizer_preset: prefs.equalizerPreset,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[Melody Supabase] Failed to sync preferences:', e);
    }
  }
}

export const storageService = new StorageService();
