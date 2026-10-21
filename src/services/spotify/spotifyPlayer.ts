/**
 * Spotify Playback Service
 *
 * Provides two playback modes behind a single interface:
 *
 * 1. FULL TRACK (Premium) — Spotify Web Playback SDK
 *    Requires: Spotify Premium account + SDK loaded in browser.
 *    Plays full, DRM-protected tracks streamed directly from Spotify.
 *    This is the only legitimate way to stream full Spotify tracks in a browser.
 *
 * 2. PREVIEW MODE (Non-Premium / No SDK) — HTML <audio> + preview_url
 *    30-second previews provided by the Spotify API.
 *    Not all tracks have preview URLs — availability varies by market and label.
 *
 * The UI sees only PlaybackStatus values — never SDK internals.
 */

import type { MusicTrack, PlaybackStatus, PlaybackPosition } from '../music/musicTypes';
import { spotifyAuth } from './spotifyAuth';

type StatusListener = (status: PlaybackStatus) => void;
type TrackListener = (track: MusicTrack | null) => void;
type PositionListener = (pos: PlaybackPosition) => void;

// ─── SDK Loader ───────────────────────────────────────────────────────────────

let sdkLoadPromise: Promise<void> | null = null;

function loadSpotifySDK(): Promise<void> {
  if (sdkLoadPromise) return sdkLoadPromise;

  sdkLoadPromise = new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Spotify) {
      resolve();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
  });

  return sdkLoadPromise;
}

// ─── Player Service ───────────────────────────────────────────────────────────

class SpotifyPlayerService {
  private sdkPlayer: Spotify.Player | null = null;
  private deviceId: string | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private _status: PlaybackStatus = 'idle';
  private _currentTrack: MusicTrack | null = null;
  private _position: PlaybackPosition | null = null;
  private isPremium = false;
  private positionInterval: number | null = null;

  private statusListeners: Set<StatusListener> = new Set();
  private trackListeners: Set<TrackListener> = new Set();
  private positionListeners: Set<PositionListener> = new Set();

  // ─── Status ────────────────────────────────────────────────────────────────

  private setStatus(status: PlaybackStatus) {
    this._status = status;
    this.statusListeners.forEach((cb) => cb(status));
  }

  private setCurrentTrack(track: MusicTrack | null) {
    this._currentTrack = track;
    this.trackListeners.forEach((cb) => cb(track));
  }

  private setPosition(pos: PlaybackPosition) {
    this._position = pos;
    this.positionListeners.forEach((cb) => cb(pos));
  }

  getStatus(): PlaybackStatus { return this._status; }
  getPosition(): PlaybackPosition | null { return this._position; }
  getCurrentTrack(): MusicTrack | null { return this._currentTrack; }

  onStatusChange(cb: StatusListener): () => void {
    this.statusListeners.add(cb);
    return () => this.statusListeners.delete(cb);
  }

  onTrackChange(cb: TrackListener): () => void {
    this.trackListeners.add(cb);
    return () => this.trackListeners.delete(cb);
  }

  onPositionChange(cb: PositionListener): () => void {
    this.positionListeners.add(cb);
    return () => this.positionListeners.delete(cb);
  }

  // ─── Initialisation ────────────────────────────────────────────────────────

  /**
   * Initialises the Spotify Web Playback SDK.
   * Returns true if Premium full-track playback is available.
   * Returns false if only 30-second previews are possible.
   */
  async initialize(_accessToken?: string): Promise<boolean> {
    this.setStatus('connecting');

    try {
      const user = spotifyAuth.loadUser();
      this.isPremium = user?.isPremium ?? false;

      if (!this.isPremium) {
        // Non-Premium: preview mode only
        this.setStatus('idle');
        return false;
      }

      await loadSpotifySDK();

      return new Promise<boolean>((resolve) => {
        this.sdkPlayer = new window.Spotify.Player({
          name: 'Melody — Feel the Beat',
          getOAuthToken: async (cb) => {
            const token = await spotifyAuth.getValidToken();
            if (token) cb(token);
          },
          volume: 0.8,
        });

        this.sdkPlayer.addListener('ready', async ({ device_id }) => {
          this.deviceId = device_id;
          console.log('[Spotify SDK] Ready with Device ID:', device_id);
          this.setStatus('idle');
          try {
            const token = await spotifyAuth.getValidToken();
            if (token) {
              await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  device_ids: [device_id],
                  play: false,
                }),
              });
            }
          } catch (e) {
            console.warn('[Spotify SDK] Auto-transfer note:', e);
          }
          resolve(true);
        });

        this.sdkPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('[Spotify SDK] Device offline:', device_id);
          this.deviceId = null;
        });

        this.sdkPlayer.addListener('initialization_error', ({ message }) => {
          console.warn('[Spotify SDK] Initialization Error:', message);
          resolve(false);
        });

        this.sdkPlayer.addListener('authentication_error', ({ message }) => {
          console.warn('[Spotify SDK] Authentication Error:', message);
          this.setStatus('auth_required');
          resolve(false);
        });

        this.sdkPlayer.addListener('account_error', ({ message }) => {
          console.warn('[Spotify SDK] Account Error:', message);
          this.isPremium = false;
          this.setStatus('unavailable');
          resolve(false);
        });

        this.sdkPlayer.addListener('playback_error', ({ message }) => {
          console.warn('[Spotify SDK] Playback Error:', message);
        });

        this.sdkPlayer.addListener('player_state_changed', (state) => {
          if (!state) return;

          const st = state.paused ? 'paused' : 'playing';
          if (this._status !== st) this.setStatus(st);

          const durationMs = state.duration ?? 0;
          const positionMs = state.position ?? 0;
          this.setPosition({
            positionMs,
            durationMs,
            progressPercent: durationMs > 0 ? (positionMs / durationMs) * 100 : 0,
          });
        });

        this.sdkPlayer.connect();
      });
    } catch (err) {
      console.warn('[Spotify SDK] Init catch:', err);
      this.setStatus('idle');
      return false;
    }
  }

  // ─── Preview Audio (Non-Premium / fallback) ────────────────────────────────

  private async playPreview(track: MusicTrack): Promise<void> {
    if (!track.previewUrl) {
      this.setStatus('unavailable');
      return;
    }

    this.stopPreview();
    this.audioEl = new Audio(track.previewUrl);
    this.audioEl.volume = 0.8;

    this.audioEl.addEventListener('playing', () => {
      this.setStatus('preview');
      this.startPreviewPositionTicker(track);
    });
    this.audioEl.addEventListener('pause', () => this.setStatus('paused'));
    this.audioEl.addEventListener('ended', () => {
      this.setStatus('idle');
      this.stopPreviewPositionTicker();
    });
    this.audioEl.addEventListener('error', () => {
      this.setStatus('error');
      this.stopPreviewPositionTicker();
    });

    this.setStatus('loading');
    this.setCurrentTrack(track);
    await this.audioEl.play().catch(() => this.setStatus('error'));
  }

  private stopPreview(): void {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
      this.audioEl = null;
    }
    this.stopPreviewPositionTicker();
  }

  private startPreviewPositionTicker(track: MusicTrack): void {
    this.stopPreviewPositionTicker();
    this.positionInterval = window.setInterval(() => {
      if (!this.audioEl) return;
      const positionMs = this.audioEl.currentTime * 1000;
      const durationMs = track.durationMs;
      this.setPosition({
        positionMs,
        durationMs,
        progressPercent: durationMs > 0 ? (positionMs / durationMs) * 100 : 0,
      });
    }, 500);
  }

  private stopPreviewPositionTicker(): void {
    if (this.positionInterval !== null) {
      clearInterval(this.positionInterval);
      this.positionInterval = null;
    }
  }

  // ─── SDK Playback (Premium) ────────────────────────────────────────────────

  private async waitForDevice(timeoutMs = 4000): Promise<string | null> {
    if (this.deviceId) return this.deviceId;
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (this.deviceId) return this.deviceId;
      await new Promise((r) => setTimeout(r, 200));
    }
    return this.deviceId;
  }

  private async playViaSDK(track: MusicTrack, positionMs = 0): Promise<void> {
    let deviceId = this.deviceId;
    if (!deviceId) {
      deviceId = await this.waitForDevice(4000);
    }

    if (!deviceId) {
      console.warn('[Spotify SDK] Device ID not ready yet, falling back to preview');
      await this.playPreview(track);
      return;
    }

    const token = await spotifyAuth.getValidToken();
    if (!token) {
      this.setStatus('auth_required');
      return;
    }

    this.setStatus('loading');
    this.setCurrentTrack(track);

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: [`spotify:track:${track.providerId}`],
            position_ms: positionMs,
          }),
        }
      );

      if (res.status === 403) {
        // Premium required — fall back to preview
        this.isPremium = false;
        this.setStatus('unavailable');
        await this.playPreview(track);
        return;
      }

      if (res.status === 404) {
        // Device not active yet — transfer device and retry play once
        await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [deviceId],
            play: true,
          }),
        });
        return;
      }

      if (!res.ok && res.status !== 204) {
        console.warn('[Spotify SDK] Playback PUT returned:', res.status);
        this.setStatus('error');
      }
    } catch (err) {
      console.warn('[Spotify SDK] playViaSDK network error:', err);
      this.setStatus('error');
    }
  }

  // ─── Public Playback API ───────────────────────────────────────────────────

  async play(track: MusicTrack, positionMs = 0): Promise<void> {
    if (this.isPremium) {
      if (!this.deviceId && this.sdkPlayer) {
        await this.waitForDevice(4000);
      }
      if (this.deviceId && this.sdkPlayer) {
        await this.playViaSDK(track, positionMs);
        return;
      }
    }
    await this.playPreview(track);
  }

  async pause(): Promise<void> {
    if (this.sdkPlayer && this.isPremium) {
      await this.sdkPlayer.pause();
    } else if (this.audioEl) {
      this.audioEl.pause();
      this.setStatus('paused');
    }
  }

  async resume(): Promise<void> {
    if (this.sdkPlayer && this.isPremium) {
      await this.sdkPlayer.resume();
    } else if (this.audioEl) {
      await this.audioEl.play().catch(() => {});
      this.setStatus('preview');
    }
  }

  async seek(positionMs: number): Promise<void> {
    if (this.sdkPlayer && this.isPremium) {
      await this.sdkPlayer.seek(positionMs);
    } else if (this.audioEl) {
      this.audioEl.currentTime = positionMs / 1000;
    }
  }

  async next(): Promise<void> {
    if (this.sdkPlayer && this.isPremium) {
      await this.sdkPlayer.nextTrack();
    }
    // Queue advancement is handled by PlayerContext for both modes
  }

  async previous(): Promise<void> {
    if (this.sdkPlayer && this.isPremium) {
      await this.sdkPlayer.previousTrack();
    }
  }

  async setVolume(volumePercent: number): Promise<void> {
    const clamped = Math.max(0, Math.min(100, volumePercent));
    if (this.sdkPlayer) await this.sdkPlayer.setVolume(clamped / 100);
    if (this.audioEl) this.audioEl.volume = clamped / 100;
  }

  destroy(): void {
    this.stopPreview();
    if (this.sdkPlayer) {
      this.sdkPlayer.disconnect();
      this.sdkPlayer = null;
    }
    this.deviceId = null;
    this.statusListeners.clear();
    this.trackListeners.clear();
    this.positionListeners.clear();
    this.setStatus('idle');
  }
}

/** Singleton Spotify player service */
export const spotifyPlayer = new SpotifyPlayerService();

