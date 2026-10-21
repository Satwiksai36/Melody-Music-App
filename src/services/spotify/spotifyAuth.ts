/**
 * Spotify Authentication — Authorization Code with PKCE
 *
 * This is the correct flow for public browser/SPA clients.
 * The Client Secret is NOT required and must NOT be present in frontend code.
 * Only the Client ID (a public identifier) is used here.
 *
 * Scopes requested:
 *   streaming            – Web Playback SDK (requires Spotify Premium)
 *   user-read-email      – Display user info
 *   user-read-private    – Detect Premium subscription
 *   user-modify-playback-state – Play/pause/seek via Connect API
 *   user-read-playback-state   – Poll current playback
 *   user-library-read    – Read liked tracks
 */

import type { MusicAuthTokens, MusicAuthUser } from '../music/musicTypes';

const CLIENT_ID =
  (import.meta.env.VITE_SPOTIFY_CLIENT_ID as string) || 'c2b14671c6c3410d80e2e69841fdadad';
const REDIRECT_URI =
  (import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string) ||
  (typeof window !== 'undefined'
    ? `${window.location.origin}/callback`
    : 'http://127.0.0.1:5173/callback');

const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-library-read',
].join(' ');

const STORAGE_KEYS = {
  CODE_VERIFIER: 'melody_pkce_verifier',
  TOKENS: 'melody_spotify_tokens',
  USER: 'melody_spotify_user',
} as const;

// ─── PKCE Helpers ─────────────────────────────────────────────────────────────

function generateRandom(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => chars[b % chars.length])
    .join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  return base64urlEncode(await sha256(verifier));
}

// ─── Token Storage (localStorage with sessionStorage fallback) ───────────────

function saveTokens(tokens: MusicAuthTokens): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  } catch {}
  try {
    sessionStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  } catch {}
}

function loadTokens(): MusicAuthTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOKENS) || sessionStorage.getItem(STORAGE_KEYS.TOKENS);
    return raw ? (JSON.parse(raw) as MusicAuthTokens) : null;
  } catch {
    return null;
  }
}

function saveUser(user: MusicAuthUser): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch {}
  try {
    sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch {}
}

function loadUser(): MusicAuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER) || sessionStorage.getItem(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as MusicAuthUser) : null;
  } catch {
    return null;
  }
}

function clearAuth(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch {}
  try {
    sessionStorage.removeItem(STORAGE_KEYS.TOKENS);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  } catch {}
}

// ─── Public Auth API ──────────────────────────────────────────────────────────

/**
 * Initiates the Spotify PKCE login flow.
 * Stores the code verifier in sessionStorage and redirects to Spotify.
 */
export async function initiateSpotifyLogin(): Promise<void> {
  if (!CLIENT_ID) {
    throw new Error(
      'VITE_SPOTIFY_CLIENT_ID is not set. Add it to your .env.local file.'
    );
  }
  if (!REDIRECT_URI) {
    throw new Error(
      'VITE_SPOTIFY_REDIRECT_URI is not set. Add it to your .env.local file.'
    );
  }

  const verifier = generateRandom(128);
  const challenge = await generateCodeChallenge(verifier);

  sessionStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, verifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Exchanges the authorization code for access + refresh tokens.
 * Call this from the /callback route after Spotify redirects back.
 */
export async function exchangeCodeForTokens(code: string): Promise<MusicAuthTokens> {
  const verifier = sessionStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
  if (!verifier) {
    throw new Error('PKCE verifier not found. The login flow may have been lost.');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Spotify token exchange failed: ${err.error_description || res.statusText}`
    );
  }

  const data = await res.json();
  const tokens: MusicAuthTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  saveTokens(tokens);
  sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  return tokens;
}

/**
 * Refreshes the access token using the stored refresh token.
 * Spotify PKCE refresh tokens are long-lived but can be revoked.
 */
export async function refreshAccessToken(refreshToken: string): Promise<MusicAuthTokens> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    clearAuth();
    throw new Error('Spotify token refresh failed — please reconnect.');
  }

  const data = await res.json();
  const tokens: MusicAuthTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  saveTokens(tokens);
  return tokens;
}

/**
 * Returns a valid access token, refreshing it automatically if expired.
 * Returns null if not authenticated.
 */
export async function getValidAccessToken(): Promise<string | null> {
  let tokens = loadTokens();
  if (!tokens) return null;

  // Refresh 60 seconds before expiry to avoid edge cases
  if (Date.now() >= tokens.expiresAt - 60_000) {
    if (!tokens.refreshToken) {
      clearAuth();
      return null;
    }
    try {
      tokens = await refreshAccessToken(tokens.refreshToken);
    } catch {
      return null;
    }
  }

  return tokens.accessToken;
}

/**
 * Fetches the current user's Spotify profile and determines Premium status.
 * Saves the user to sessionStorage.
 */
export async function fetchAndSaveSpotifyUser(accessToken: string): Promise<MusicAuthUser> {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error('Failed to fetch Spotify user profile.');

  const data = await res.json();
  const user: MusicAuthUser = {
    id: data.id,
    name: data.display_name ?? data.id,
    email: data.email ?? '',
    avatarUrl: data.images?.[0]?.url ?? '',
    isPremium: data.product === 'premium',
    provider: 'spotify',
  };

  saveUser(user);
  return user;
}

export const spotifyAuth = {
  initiateLogin: initiateSpotifyLogin,
  exchangeCode: exchangeCodeForTokens,
  refreshToken: refreshAccessToken,
  getValidToken: getValidAccessToken,
  fetchUser: fetchAndSaveSpotifyUser,
  loadTokens,
  loadUser,
  clearAuth,
};

