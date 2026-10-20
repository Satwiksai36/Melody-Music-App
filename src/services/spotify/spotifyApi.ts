/**
 * Spotify Web API — Catalog Search and Metadata
 *
 * Handles track search, track/artist/album metadata using the official
 * Spotify Web API. Always uses a fresh access token via spotifyAuth.
 *
 * Note: Catalog searchability ≠ playback availability.
 * A track appearing in search results does not guarantee it can be
 * played — availability depends on account type and market restrictions.
 */

import type {
  MusicTrack,
  MusicArtist,
  MusicAlbum,
  MusicSearchResult,
  IMusicCatalogService,
} from '../music/musicTypes';
import { spotifyAuth } from './spotifyAuth';

const BASE = 'https://api.spotify.com/v1';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function spotifyFetch<T>(path: string): Promise<T> {
  const token = await spotifyAuth.getValidToken();
  if (!token) throw new Error('Spotify not authenticated');

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    spotifyAuth.clearAuth();
    throw new Error('Spotify session expired — please reconnect.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      `Spotify API error ${res.status}: ${body?.error?.message ?? res.statusText}`
    );
  }
  return res.json() as Promise<T>;
}

// ─── Response Mappers ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTrack(item: any): MusicTrack {
  return {
    providerId: item.id,
    provider: 'spotify',
    title: item.name,
    artist: item.artists?.map((a: any) => a.name).join(', ') ?? '',
    album: item.album?.name ?? item.name,
    artworkUrl:
      item.album?.images?.[0]?.url ??
      item.images?.[0]?.url ??
      '',
    durationMs: item.duration_ms ?? 0,
    previewUrl: item.preview_url ?? null,
    /**
     * isPlayable reflects the Spotify API `is_playable` field which
     * accounts for market availability. It does NOT guarantee Premium access —
     * the Web Playback SDK still requires a Premium subscription.
     */
    isPlayable: item.is_playable !== false,
    externalUrl: item.external_urls?.spotify ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArtist(item: any): MusicArtist {
  return {
    providerId: item.id,
    provider: 'spotify',
    name: item.name,
    artworkUrl: item.images?.[0]?.url ?? '',
    genres: item.genres ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAlbum(item: any, tracks: MusicTrack[] = []): MusicAlbum {
  return {
    providerId: item.id,
    provider: 'spotify',
    title: item.name,
    artist: item.artists?.map((a: any) => a.name).join(', ') ?? '',
    artworkUrl: item.images?.[0]?.url ?? '',
    releaseYear: (item.release_date ?? '').split('-')[0],
    trackCount: item.total_tracks ?? tracks.length,
    tracks,
  };
}

// ─── Catalog Service Implementation ───────────────────────────────────────────

export const spotifyApi: IMusicCatalogService = {
  async search(query: string, limit = 20): Promise<MusicSearchResult> {
    const q = encodeURIComponent(query);
    const data = await spotifyFetch<any>(
      `/search?q=${q}&type=track,artist,album&limit=${limit}&market=from_token`
    );

    const tracks: MusicTrack[] = (data.tracks?.items ?? []).map(mapTrack);
    const artists: MusicArtist[] = (data.artists?.items ?? []).map(mapArtist);
    const albums: MusicAlbum[] = (data.albums?.items ?? []).map((a: any) =>
      mapAlbum(a)
    );

    return {
      tracks,
      artists,
      albums,
      totalTracks: data.tracks?.total ?? tracks.length,
    };
  },

  async getTrack(providerId: string): Promise<MusicTrack | null> {
    try {
      const data = await spotifyFetch<any>(
        `/tracks/${providerId}?market=from_token`
      );
      return mapTrack(data);
    } catch {
      return null;
    }
  },

  async getAlbum(providerId: string): Promise<MusicAlbum | null> {
    try {
      const data = await spotifyFetch<any>(
        `/albums/${providerId}?market=from_token`
      );
      const tracks = (data.tracks?.items ?? []).map(mapTrack);
      return mapAlbum(data, tracks);
    } catch {
      return null;
    }
  },

  async getArtist(providerId: string): Promise<MusicArtist | null> {
    try {
      const data = await spotifyFetch<any>(`/artists/${providerId}`);
      return mapArtist(data);
    } catch {
      return null;
    }
  },
};

/**
 * Searches Spotify for a track by title and artist name.
 * Returns the best-matching MusicTrack or null if no results.
 * Used internally to resolve an internal Track to its Spotify equivalent.
 */
export async function resolveTrackOnSpotify(
  title: string,
  artist: string
): Promise<MusicTrack | null> {
  try {
    const query = `track:${title} artist:${artist}`;
    const results = await spotifyApi.search(query, 5);
    if (results.tracks.length === 0) {
      // Fallback: free text search
      const fallback = await spotifyApi.search(`${title} ${artist}`, 5);
      return fallback.tracks[0] ?? null;
    }
    return results.tracks[0];
  } catch {
    return null;
  }
}

