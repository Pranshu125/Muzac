import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { Innertube, UniversalCache } from 'youtubei.js';

let ytClient = null;
let ytClientPromise = null;

export async function getYtClient() {
  if (ytClient) return ytClient;
  if (!ytClientPromise) {
    ytClientPromise = Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true
    }).then(client => {
      ytClient = client;
      return client;
    }).catch(err => {
      ytClientPromise = null;
      console.error('Failed to initialize Innertube client:', err.message);
      throw err;
    });
  }
  return ytClientPromise;
}

// Convert seconds to mm:ss
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Parse duration string like "3:45" to seconds
export function parseDurationToSeconds(str) {
  if (!str) return 0;
  const parts = str.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

// In-memory cache for fast, snappy search responses
const searchCache = new Map();

// Search tracks, videos, and music
export async function searchTracks(query, filter = 'all') {
  const cacheKey = `${query.toLowerCase().trim()}:::${filter}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const results = [];

  try {
    const yt = await getYtClient();
    const search = await yt.search(query, {
      type: filter === 'video' ? 'video' : 'video'
    });

    if (search.videos && search.videos.length > 0) {
      for (const v of search.videos) {
        if (!v.id) continue;
        const durationSec = v.duration?.seconds || parseDurationToSeconds(v.duration?.text);
        
        const thumbnail = v.thumbnails?.[v.thumbnails.length - 1]?.url || 
          `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;

        const author = v.author?.name || v.channel?.name || 'Unknown Artist';

        results.push({
          id: v.id,
          title: v.title?.text || v.title?.runs?.[0]?.text || 'Untitled Song',
          artist: author,
          duration: durationSec,
          durationFormatted: v.duration?.text || formatDuration(durationSec),
          thumbnail: thumbnail,
          album: 'Single',
          views: v.views?.text || '',
          published: v.published?.text || '',
          type: 'song'
        });
      }
    }
  } catch (err) {
    console.error('Search error in ytmusic.js:', err.message);
  }

  // Fallback: If YouTube search fails or is throttled, search curated featured library
  if (results.length === 0) {
    const qLower = query.toLowerCase();
    const catalog = [...FEATURED_TRENDING_TRACKS, ...TRENDING_MUSIC_VIDEOS];
    const matched = catalog.filter(t => 
      t.title.toLowerCase().includes(qLower) || 
      t.artist.toLowerCase().includes(qLower) ||
      (t.genre && t.genre.toLowerCase().includes(qLower))
    );
    for (const m of matched) {
      if (!results.some(r => r.id === m.id)) {
        results.push(m);
      }
    }
  }

  if (results.length > 0) {
    searchCache.set(cacheKey, results);
  }

  return results;
}

const artistCache = new Map();
const radioCache = new Map();

// Full Artist Profile & Discography
export async function getArtistProfile(artistName) {
  const cleanName = artistName.trim();
  const cacheKey = cleanName.toLowerCase();
  if (artistCache.has(cacheKey)) {
    return artistCache.get(cacheKey);
  }

  try {
    // Top songs
    const topTracks = await searchTracks(`${cleanName} top songs audio`, 'song');
    // Music videos
    const musicVideos = await searchTracks(`${cleanName} official music video`, 'video');

    const profile = {
      name: cleanName,
      verified: true,
      monthlyListeners: '48.5M',
      bio: `${cleanName} is a globally celebrated recording artist with billions of streams across Apple Music and YouTube Music.`,
      banner: topTracks[0]?.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000',
      avatar: topTracks[0]?.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      topTracks: topTracks.slice(0, 10),
      musicVideos: musicVideos.slice(0, 6),
      albums: [
        { title: 'Greatest Hits & Essentials', year: '2026', trackCount: 16, thumbnail: topTracks[0]?.thumbnail },
        { title: 'The Master Collection', year: '2024', trackCount: 14, thumbnail: topTracks[1]?.thumbnail || topTracks[0]?.thumbnail },
        { title: 'Live in Concert (Apple Music Live)', year: '2023', trackCount: 12, thumbnail: topTracks[2]?.thumbnail || topTracks[0]?.thumbnail }
      ],
      relatedArtists: [
        { name: 'Daft Punk', genre: 'Electronic / Synthpop', thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300' },
        { name: 'Kendrick Lamar', genre: 'Hip-Hop', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300' },
        { name: 'Travis Scott', genre: 'Trap / Psychedelic', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300' },
        { name: 'Post Malone', genre: 'Pop / Rock', thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300' }
      ]
    };

    artistCache.set(cacheKey, profile);
    return profile;
  } catch (err) {
    console.error('Artist profile error:', err.message);
    return null;
  }
}

// Get Related / Radio tracks with YouTube Music Tuner modes
export async function getRadioTracks(videoId, trackTitle, artistName, tunerMode = 'familiar') {
  const cacheKey = `${videoId}:::${tunerMode}`;
  if (radioCache.has(cacheKey)) {
    return radioCache.get(cacheKey);
  }

  let queryModifier = 'music';
  
  if (tunerMode === 'discover') queryModifier = 'similar new songs';
  else if (tunerMode === 'deep-cuts') queryModifier = 'underrated b sides album tracks';
  else if (tunerMode === 'uptempo') queryModifier = 'high bpm dance energetic remix';
  else if (tunerMode === 'chill') queryModifier = 'acoustic chill ambient slow';

  const list = [];

  try {
    const yt = await getYtClient();
    const info = await yt.getInfo(videoId);
    if (info.related_videos && info.related_videos.length > 0) {
      for (const v of info.related_videos.slice(0, 15)) {
        if (!v.id) continue;
        const durationSec = v.duration?.seconds || parseDurationToSeconds(v.duration?.text);
        list.push({
          id: v.id,
          title: v.title?.text || 'Untitled Song',
          artist: v.author?.name || artistName || 'Unknown Artist',
          duration: durationSec,
          durationFormatted: v.duration?.text || formatDuration(durationSec),
          thumbnail: v.thumbnails?.[v.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
          album: `Radio (${tunerMode})`,
          type: 'song'
        });
      }
    }
  } catch (err) {
    console.error('Radio lookup error:', err.message);
  }

  // Fallback / Tuner mode enhancement
  let finalList = list;
  if (list.length < 8 && (artistName || trackTitle)) {
    const fallback = await searchTracks(`${artistName || trackTitle} ${queryModifier}`, 'song');
    const filtered = fallback.filter(t => t.id !== videoId);
    finalList = [...list, ...filtered].slice(0, 15);
  }

  if (finalList.length > 0) {
    radioCache.set(cacheKey, finalList);
  }

  return finalList;
}

// Apple Music Top 100 City Charts
export const CITY_CHARTS = [
  { city: 'Tokyo', country: 'Japan', query: 'top hits tokyo japan jpop billboard', thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400' },
  { city: 'New York', country: 'United States', query: 'top hits new york billboard 100', thumbnail: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
  { city: 'London', country: 'United Kingdom', query: 'top hits london uk official charts', thumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' },
  { city: 'Paris', country: 'France', query: 'top hits paris france charts', thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
  { city: 'Seoul', country: 'South Korea', query: 'top hits seoul kpop melon chart', thumbnail: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400' },
  { city: 'Los Angeles', country: 'United States', query: 'top hits los angeles california pop', thumbnail: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=400' },
  { city: 'Toronto', country: 'Canada', query: 'top hits toronto r&b hip hop', thumbnail: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=400' },
  { city: 'Mumbai', country: 'India', query: 'top hits mumbai bollywood trending', thumbnail: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400' }
];

// Popular Featured Tracks / Home Picks
export const FEATURED_TRENDING_TRACKS = [
  {
    id: 'fHI8X4OXluQ',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 204,
    durationFormatted: '3:24',
    thumbnail: 'https://i.ytimg.com/vi/fHI8X4OXluQ/maxresdefault.jpg',
    type: 'song',
    genre: 'Synthpop'
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    duration: 213,
    durationFormatted: '3:33',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    type: 'song',
    genre: 'Pop'
  },
  {
    id: '4NRXx6U8ABQ',
    title: 'Starboy (ft. Daft Punk)',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: 230,
    durationFormatted: '3:50',
    thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg',
    type: 'song',
    genre: 'R&B / Electro'
  },
  {
    id: 'hT_nvWreIhg',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    album: 'Native',
    duration: 257,
    durationFormatted: '4:17',
    thumbnail: 'https://i.ytimg.com/vi/hT_nvWreIhg/maxresdefault.jpg',
    type: 'song',
    genre: 'Pop Rock'
  },
  {
    id: 'JGwWNGJdvx8',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233,
    durationFormatted: '3:53',
    thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
    type: 'song',
    genre: 'Pop'
  },
  {
    id: '7wtfhZwyrcc',
    title: 'Believer',
    artist: 'Imagine Dragons',
    album: 'Evolve',
    duration: 204,
    durationFormatted: '3:24',
    thumbnail: 'https://i.ytimg.com/vi/7wtfhZwyrcc/maxresdefault.jpg',
    type: 'song',
    genre: 'Alternative Rock'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    album: 'VIDA',
    duration: 228,
    durationFormatted: '3:48',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
    type: 'song',
    genre: 'Latin Pop'
  },
  {
    id: '09R8_2nJtjg',
    title: 'Sugar',
    artist: 'Maroon 5',
    album: 'V',
    duration: 235,
    durationFormatted: '3:55',
    thumbnail: 'https://i.ytimg.com/vi/09R8_2nJtjg/maxresdefault.jpg',
    type: 'song',
    genre: 'Pop / Funk'
  }
];

// Moods and Genres for discovery
export const MOODS_AND_GENRES = [
  { name: 'Chill & Relax', query: 'chill lofi acoustic music', icon: 'coffee', color: 'from-blue-600 to-indigo-900' },
  { name: 'Workout & Energy', query: 'high energy workout motivational music', icon: 'zap', color: 'from-rose-600 to-amber-700' },
  { name: 'Deep Focus & Study', query: 'focus ambient piano study music', icon: 'brain', color: 'from-emerald-600 to-teal-900' },
  { name: 'Hip-Hop & Rap', query: 'top hip hop rap hits', icon: 'mic', color: 'from-amber-600 to-orange-900' },
  { name: 'Rock & Alternative', query: 'rock classics modern rock anthems', icon: 'disc', color: 'from-purple-600 to-violet-900' },
  { name: 'Electronic & Dance', query: 'edm electronic dance music festival', icon: 'activity', color: 'from-cyan-600 to-blue-900' },
  { name: 'Pop Hits', query: 'global pop hits billboard top 100', icon: 'music', color: 'from-pink-600 to-rose-900' },
  { name: 'Late Night R&B', query: 'smooth r&b soul late night vibes', icon: 'moon', color: 'from-indigo-600 to-purple-900' }
];

// Curated & Trending Music Videos Hub (4K / 1080p Ultra HD)
export const TRENDING_MUSIC_VIDEOS = [
  {
    id: 'fHI8X4OXluQ',
    title: 'Blinding Lights (Official Music Video)',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 260,
    durationFormatted: '4:20',
    thumbnail: 'https://i.ytimg.com/vi/fHI8X4OXluQ/maxresdefault.jpg',
    views: '2.8B views',
    resolution: '4K UHD',
    genre: 'Synthpop',
    type: 'video'
  },
  {
    id: '4NRXx6U8ABQ',
    title: 'Starboy (Official Video) ft. Daft Punk',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: 238,
    durationFormatted: '3:58',
    thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg',
    views: '2.4B views',
    resolution: '4K UHD',
    genre: 'R&B / Electro',
    type: 'video'
  },
  {
    id: 'hT_nvWreIhg',
    title: 'Counting Stars (Official Music Video)',
    artist: 'OneRepublic',
    album: 'Native',
    duration: 284,
    durationFormatted: '4:44',
    thumbnail: 'https://i.ytimg.com/vi/hT_nvWreIhg/maxresdefault.jpg',
    views: '4.1B views',
    resolution: '1080p Full HD',
    genre: 'Pop Rock',
    type: 'video'
  },
  {
    id: 'JGwWNGJdvx8',
    title: 'Shape of You (Official Music Video)',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 263,
    durationFormatted: '4:23',
    thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
    views: '6.2B views',
    resolution: '4K UHD',
    genre: 'Pop',
    type: 'video'
  },
  {
    id: '7wtfhZwyrcc',
    title: 'Believer (Official Music Video)',
    artist: 'Imagine Dragons',
    album: 'Evolve',
    duration: 216,
    durationFormatted: '3:36',
    thumbnail: 'https://i.ytimg.com/vi/7wtfhZwyrcc/maxresdefault.jpg',
    views: '2.7B views',
    resolution: '4K UHD',
    genre: 'Alternative Rock',
    type: 'video'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Despacito (Official Music Video)',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    album: 'VIDA',
    duration: 281,
    durationFormatted: '4:41',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
    views: '8.5B views',
    resolution: '1080p Full HD',
    genre: 'Latin Pop',
    type: 'video'
  },
  {
    id: '09R8_2nJtjg',
    title: 'Sugar (Official Music Video)',
    artist: 'Maroon 5',
    album: 'V',
    duration: 301,
    durationFormatted: '5:01',
    thumbnail: 'https://i.ytimg.com/vi/09R8_2nJtjg/maxresdefault.jpg',
    views: '4.0B views',
    resolution: '1080p Full HD',
    genre: 'Pop / Funk',
    type: 'video'
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up (4K Remaster)',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    duration: 213,
    durationFormatted: '3:33',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    views: '1.5B views',
    resolution: '4K Remaster',
    genre: '80s Pop',
    type: 'video'
  }
];

export async function getTrendingVideos(genre = 'all') {
  if (genre && genre !== 'all') {
    const live = await searchTracks(`${genre} top official music video`, 'video');
    if (live.length > 0) {
      return live.map(v => ({
        ...v,
        type: 'video',
        resolution: '1080p Full HD'
      }));
    }
  }
  return TRENDING_MUSIC_VIDEOS;
}

