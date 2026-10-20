/**
 * Spotify Service — Public API
 *
 * Import from this file rather than individual Spotify service modules
 * to keep imports clean and enable easy future provider swaps.
 */

export { spotifyAuth } from './spotifyAuth';
export { spotifyApi, resolveTrackOnSpotify } from './spotifyApi';
export { spotifyPlayer } from './spotifyPlayer';
export { musicTrackToInternalTrack, getSpotifyTrackId } from './spotifyAdapter';
export type { MusicTrack, MusicSearchResult, PlaybackStatus, MusicAuthUser } from '../music/musicTypes';

