/**
 * Spotify Web API — Catalog Search and Metadata
 *
 * Handles track search, track/artist/album metadata using the official
 * Spotify Web API. Automatically falls back to Client Credentials
 * when user token is not present so catalog search & browsing always work.
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
const CLIENT_ID = (import.meta.env.VITE_SPOTIFY_CLIENT_ID as string) || 'c2b14671c6c3410d80e2e69841fdadad';
const CLIENT_SECRET = (import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string) || 'd4448cb06c284296af6848f8ce0ed3b5';

// ─── Token Management ─────────────────────────────────────────────────────────

let cachedClientToken: { token: string; expiresAt: number } | null = null;

async function getClientCredentialsToken(): Promise<string | null> {
  if (cachedClientToken && Date.now() < cachedClientToken.expiresAt - 60_000) {
    return cachedClientToken.token;
  }
  if (!CLIENT_ID || !CLIENT_SECRET) return null;

  try {
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) return null;
    const data = await res.json();
    cachedClientToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    };
    return cachedClientToken.token;
  } catch (err) {
    console.warn('[spotifyApi] Could not fetch client credentials token:', err);
    return null;
  }
}

async function getAnyValidToken(): Promise<string> {
  // 1. Try logged-in user PKCE token
  try {
    const userToken = await spotifyAuth.getValidToken();
    if (userToken) return userToken;
  } catch {
    // fallback
  }

  // 2. Fall back to Client Credentials (catalog search and discovery)
  const clientToken = await getClientCredentialsToken();
  if (clientToken) return clientToken;

  throw new Error('Spotify API token unavailable');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function spotifyFetch<T>(path: string): Promise<T> {
  const token = await getAnyValidToken();

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    // User token might have expired, clear cached client token and retry with fresh client token
    cachedClientToken = null;
    try {
      const freshToken = await getClientCredentialsToken();
      if (freshToken) {
        const retryRes = await fetch(`${BASE}${path}`, {
          headers: { Authorization: `Bearer ${freshToken}` },
        });
        if (retryRes.ok) return retryRes.json() as Promise<T>;
      }
    } catch {
      // ignore
    }
    spotifyAuth.clearAuth();
    throw new Error('Spotify session expired');
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

export const spotifyApi: IMusicCatalogService & {
  getGenreTracks: (genre: string, limit?: number) => Promise<MusicTrack[]>;
  getTopIndianHits: (limit?: number) => Promise<MusicTrack[]>;
} = {
  async search(query: string, limit = 20): Promise<MusicSearchResult> {
    const cleanQ = query.trim();
    if (!cleanQ) {
      return { tracks: [], artists: [], albums: [], totalTracks: 0 };
    }
    const q = encodeURIComponent(cleanQ);
    const data = await spotifyFetch<any>(
      `/search?q=${q}&type=track,artist,album&limit=${limit}`
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
      const data = await spotifyFetch<any>(`/tracks/${providerId}`);
      return mapTrack(data);
    } catch {
      return null;
    }
  },

  async getAlbum(providerId: string): Promise<MusicAlbum | null> {
    try {
      const data = await spotifyFetch<any>(`/albums/${providerId}`);
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

  async getNewReleases(limit = 12): Promise<MusicTrack[]> {
    try {
      // Direct search for 2024-2025 releases
      const searchRes = await spotifyApi.search('year:2024 OR year:2025 Telugu Bollywood Tamil', limit);
      if (searchRes.tracks.length > 0) {
        return searchRes.tracks;
      }

      const data = await spotifyFetch<any>(`/browse/new-releases?limit=${limit}`);
      const albums = data.albums?.items ?? [];
      const tracks: MusicTrack[] = [];
      for (const alb of albums.slice(0, 8)) {
        try {
          const albData = await spotifyFetch<any>(`/albums/${alb.id}`);
          if (albData.tracks?.items?.[0]) {
            tracks.push(mapTrack({ ...albData.tracks.items[0], album: alb }));
          }
        } catch {
          // ignore
        }
      }
      return tracks;
    } catch (e) {
      console.warn('[Spotify API] getNewReleases error:', e);
      return [];
    }
  },

  async getGenreTracks(genre: string, limit = 10): Promise<MusicTrack[]> {
    try {
      let q = 'Top Indian Hits 2024 2025';
      if (genre === 'telugu') q = 'Telugu Super Hits 2024 2025';
      else if (genre === 'hindi') q = 'Bollywood Top 50 2024 2025';
      else if (genre === 'tamil') q = 'Tamil Top Hits 2024 2025 Anirudh';
      else if (genre === 'english') q = 'Top Global Hits 2024 2025 Pop';

      const res = await spotifyApi.search(q, limit);
      return res.tracks;
    } catch {
      return [];
    }
  },

  async getTopIndianHits(limit = 10): Promise<MusicTrack[]> {
    try {
      const res = await spotifyApi.search('Hot Hits India 2024 2025', limit);
      return res.tracks;
    } catch {
      return [];
    }
  },
};

/**
 * Searches Spotify for a track by title and artist name.
 * Returns the best-matching MusicTrack or null if no results.
 */
export async function resolveTrackOnSpotify(
  title: string,
  artist: string,
  album?: string
): Promise<MusicTrack | null> {
  try {
    const cleanTitle = title.replace(/\([^)]*\)/g, '').trim();
    const primaryArtist = (artist || '').split(/[,&/]/)[0].trim();

    // 1. Title + Primary Artist free text (highest hit rate on Spotify)
    if (primaryArtist) {
      const res1 = await spotifyApi.search(`${cleanTitle} ${primaryArtist}`, 5);
      if (res1.tracks.length > 0) return res1.tracks[0];
    }

    // 2. Title + Movie / Album name
    if (album) {
      const cleanAlbum = album.replace(/\([^)]*\)/g, '').trim();
      const res2 = await spotifyApi.search(`${cleanTitle} ${cleanAlbum}`, 5);
      if (res2.tracks.length > 0) return res2.tracks[0];
    }

    // 3. Clean Title search alone
    const res3 = await spotifyApi.search(cleanTitle, 5);
    if (res3.tracks.length > 0) return res3.tracks[0];

    return null;
  } catch (err) {
    console.warn('[Spotify API] Resolve track error:', err);
    return null;
  }
}
