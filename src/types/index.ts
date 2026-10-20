export interface LyricWord {
  word: string;
  startTime: number; // in seconds
  endTime: number;
}

export interface LyricLine {
  id: string;
  text: string;
  startTime: number; // in seconds
  endTime: number;
  words?: LyricWord[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  movieOrAlbum?: string;
  coverUrl: string;
  duration: number; // in seconds
  audioUrl?: string;
  genre: 'telugu' | 'hindi' | 'tamil' | 'punjabi' | 'english' | 'malayalam';
  isLossless?: boolean;
  playsCount?: string;
  year?: string;
  lyrics?: LyricLine[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: string;
  language: string;
  trackCount: number;
  durationText: string;
  composer: string;
  starring: string;
  director: string;
  playsCount: string;
  tracks: Track[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  coverImages?: string[];
  trackCount: number;
  durationText: string;
  isPinned?: boolean;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  language: string;
  imageUrl: string;
  tagline: string;
  isSelected?: boolean;
}
