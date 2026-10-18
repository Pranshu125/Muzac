export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  durationFormatted?: string;
  thumbnail: string;
  audioUrl?: string; // For local or custom audio
  isLocal?: boolean;
  file?: File;
  type?: 'song' | 'video' | 'podcast';
  views?: string;
  genre?: string;
  spotifyUrl?: string;
  description?: string;
  podcastName?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  tracks: Track[];
  isCustom?: boolean;
  genre?: string;
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface LyricsData {
  syncedLyrics: LyricLine[];
  plainLyrics: string;
  source: 'lrclib' | 'ytmusic' | 'none';
}

export interface EQPreset {
  name: string;
  gains: number[]; // 10 bands (-12 to +12 dB)
}

export interface PodcastEpisode {
  id: string;
  title: string;
  podcastName: string;
  description: string;
  duration: number;
  durationFormatted: string;
  date: string;
  thumbnail: string;
  type: 'podcast';
}

export interface PodcastShow {
  id: string;
  title: string;
  publisher: string;
  category: string;
  description: string;
  thumbnail: string;
  subscribers: string;
  episodes: PodcastEpisode[];
}

export interface ArtistAlbum {
  title: string;
  year: string;
  trackCount: number;
  thumbnail?: string;
}

export interface RelatedArtist {
  name: string;
  genre: string;
  thumbnail: string;
}

export interface ArtistProfile {
  name: string;
  verified: boolean;
  monthlyListeners: string;
  bio: string;
  banner: string;
  avatar: string;
  topTracks: Track[];
  musicVideos: Track[];
  albums: ArtistAlbum[];
  relatedArtists: RelatedArtist[];
}

export interface CityChart {
  city: string;
  country: string;
  query: string;
  thumbnail: string;
}

export type RadioTunerMode = 'familiar' | 'discover' | 'deep-cuts' | 'uptempo' | 'chill';

export type ViewMode = 
  | 'home' 
  | 'explore' 
  | 'podcasts' 
  | 'videos' 
  | 'video'
  | 'spotify' 
  | 'artist'
  | 'replay'
  | 'city-charts'
  | 'liked' 
  | 'downloads' 
  | 'local' 
  | 'playlist';

export type CategoryFilter = 
  | 'all' 
  | 'music' 
  | 'podcasts' 
  | 'videos' 
  | 'chill' 
  | 'workout' 
  | 'focus';

export type SoundstageMode = 'balanced' | 'wide' | 'cinema3d' | 'mono';

export interface AudioOutputDevice {
  id: string;
  name: string;
  type: 'computer' | 'airplay' | 'bluetooth' | 'cast';
  isActive: boolean;
  quality: string;
}

