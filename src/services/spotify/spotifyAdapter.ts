/**
 * Adapts Spotify MusicTrack → Melody internal Track type.
 * Keeps the UI and PlayerContext independent of Spotify types.
 */

import type { MusicTrack } from '../music/musicTypes';
import type { Track } from '../../types';

/** Maps a Spotify MusicTrack to the Melody-internal Track model */
export function musicTrackToInternalTrack(mt: MusicTrack): Track {
  // Determine genre from artist/album heuristics — Spotify doesn't expose
  // per-track genre; use a simple keyword check as a best-effort signal.
  const lc = `${mt.artist} ${mt.album} ${mt.title}`.toLowerCase();
  let genre: Track['genre'] = 'hindi'; // default
  if (lc.includes('telugu') || lc.includes('tollywood') || lc.includes('andhra')) genre = 'telugu';
  else if (lc.includes('tamil') || lc.includes('kollywood')) genre = 'tamil';
  else if (lc.includes('punjabi') || lc.includes('bhangra')) genre = 'punjabi';
  else if (lc.includes('english') || lc.includes('pop') || lc.includes('indie')) genre = 'english';
  else if (lc.includes('malayalam') || lc.includes('mollywood')) genre = 'malayalam';

  return {
    id: `spotify:${mt.providerId}`,
    title: mt.title,
    artist: mt.artist,
    movieOrAlbum: mt.album,
    coverUrl: mt.artworkUrl,
    duration: Math.round(mt.durationMs / 1000),
    // previewUrl stored in audioUrl as reference for the player
    audioUrl: mt.previewUrl ?? undefined,
    genre,
    isLossless: false, // Spotify streams are lossy (OGG Vorbis / AAC)
    year: undefined,
  };
}

/**
 * Extracts the raw Spotify track ID from an internal Track id field.
 * Internal Track IDs are stored as "spotify:<spotifyId>" when sourced from Spotify.
 */
export function getSpotifyTrackId(internalId: string): string | null {
  if (internalId.startsWith('spotify:')) {
    return internalId.replace('spotify:', '');
  }
  return null;
}

