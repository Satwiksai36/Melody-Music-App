/**
 * Provider-independent music service type contracts.
 *
 * The Melody UI depends only on these types — never on Spotify SDK types directly.
 * This allows swapping or combining providers (Spotify, JioSaavn, etc.) without
 * touching any screen or component.
 */

// ─── Playback States ─────────────────────────────────────────────────────────

export type PlaybackStatus =
  | 'idle'          // No track loaded
  | 'connecting'    // Initialising SDK / authenticating
  | 'loading'       // Track is buffering
  | 'playing'       // Active playback
  | 'paused'        // Paused by user
  | 'unavailable'   // Track not playable on current account/region
  | 'preview'       // Playing 30-second preview (not full track)
  | 'auth_required' // Provider connection not established
  | 'error';        // Unrecoverable playback error

// ─── Common Track Model ───────────────────────────────────────────────────────

export interface MusicTrack {
  /** Provider-native track ID (e.g. Spotify track ID) */
  providerId: string;
  provider: 'spotify' | 'jiosaavn' | 'mock';
  title: string;
  artist: string;
  album: string;
  artworkUrl: string;
  /** Full track duration in milliseconds */
  durationMs: number;
  /**
   * 30-second preview URL if the provider exposes one; null otherwise.
   * Not available for all tracks, especially in some markets.
   */
  previewUrl: string | null;
  /**
   * True ONLY when the authenticated account can play the full track via the
   * active provider SDK. Requires a valid Premium subscription for Spotify.
   */
  isPlayable: boolean;
  externalUrl: string;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface MusicSearchResult {
  tracks: MusicTrack[];
  artists: MusicArtist[];
  albums: MusicAlbum[];
  totalTracks: number;
}

export interface MusicArtist {
  providerId: string;
  provider: string;
  name: string;
  artworkUrl: string;
  genres: string[];
}

export interface MusicAlbum {
  providerId: string;
  provider: string;
  title: string;
  artist: string;
  artworkUrl: string;
  releaseYear: string;
  trackCount: number;
  tracks: MusicTrack[];
}

// ─── Playback Position ────────────────────────────────────────────────────────

export interface PlaybackPosition {
  positionMs: number;
  durationMs: number;
  progressPercent: number;
}

// ─── Service Interfaces ───────────────────────────────────────────────────────

/** Catalog search and metadata — separate from playback capability */
export interface IMusicCatalogService {
  search(query: string, limit?: number): Promise<MusicSearchResult>;
  getTrack(providerId: string): Promise<MusicTrack | null>;
  getAlbum(providerId: string): Promise<MusicAlbum | null>;
  getArtist(providerId: string): Promise<MusicArtist | null>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface MusicAuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  /** Spotify Premium required for full-track playback via Web Playback SDK */
  isPremium: boolean;
  provider: 'spotify';
}

export interface MusicAuthTokens {
  accessToken: string;
  /** Refresh token — only available when offline_access scope is granted */
  refreshToken?: string;
  /** Unix timestamp in ms when the access token expires */
  expiresAt: number;
}

