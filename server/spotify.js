import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import axios from 'axios';

// In-memory cache for Spotify playlist data (TTL-free for instant repeat access)
const spotifyCache = new Map();

// Helper to fetch and parse Spotify playlists, albums, and tracks from Spotify Embeds (no API keys required!)
export async function getSpotifyData(urlOrId) {
  try {
    let cleanUrl = urlOrId.trim();
    if (!cleanUrl.startsWith('http')) {
      if (cleanUrl.includes('playlist/')) {
        cleanUrl = `https://open.spotify.com/playlist/${cleanUrl.split('playlist/')[1].split('?')[0]}`;
      } else if (cleanUrl.includes('album/')) {
        cleanUrl = `https://open.spotify.com/album/${cleanUrl.split('album/')[1].split('?')[0]}`;
      } else if (cleanUrl.includes('track/')) {
        cleanUrl = `https://open.spotify.com/track/${cleanUrl.split('track/')[1].split('?')[0]}`;
      } else {
        // Default to playlist id
        cleanUrl = `https://open.spotify.com/playlist/${cleanUrl}`;
      }
    }

    if (spotifyCache.has(cleanUrl)) {
      return spotifyCache.get(cleanUrl);
    }

    // Convert to embed URL
    const embedUrl = cleanUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
    const response = await axios.get(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 8000
    });

    const html = response.data;
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

    if (match && match[1]) {
      const data = JSON.parse(match[1]);
      const entity = data.props?.pageProps?.state?.data?.entity;
      if (entity) {
        const tracks = (entity.trackList || []).map((t, idx) => ({
          id: t.id || `spotify-${idx}`,
          title: t.title || t.name,
          artist: t.subtitle || (t.artists ? t.artists.map(a => a.name).join(', ') : 'Unknown Artist'),
          duration: Math.round((t.duration || 180000) / 1000),
          thumbnail: entity.coverArt?.sources?.[0]?.url || t.coverArt?.sources?.[0]?.url || '',
          album: entity.name || 'Spotify Import',
          spotifyUrl: cleanUrl
        }));

        const result = {
          id: entity.id,
          title: entity.name || entity.title,
          description: entity.subtitle || entity.description || 'Imported from Spotify',
          thumbnail: entity.coverArt?.sources?.[0]?.url || '',
          type: entity.type || 'playlist',
          trackCount: tracks.length,
          tracks
        };
        spotifyCache.set(cleanUrl, result);
        return result;
      }
    }

    // Fallback: oEmbed
    const oembed = await axios.get(`https://open.spotify.com/oembed?url=${encodeURIComponent(cleanUrl)}`);
    const fallbackResult = {
      id: 'custom-spotify',
      title: oembed.data.title || 'Spotify Playlist',
      description: 'Imported from Spotify',
      thumbnail: oembed.data.thumbnail_url || '',
      type: 'playlist',
      trackCount: 0,
      tracks: []
    };
    if (fallbackResult.tracks.length > 0) {
      spotifyCache.set(cleanUrl, fallbackResult);
    }
    return fallbackResult;
  } catch (err) {
    console.error('Error fetching Spotify data:', err.message);
    throw new Error(`Failed to parse Spotify link: ${err.message}`);
  }
}

// Curated Spotify Top Chart Playlists for instant browsing
export const CURATED_SPOTIFY_PLAYLISTS = [
  {
    id: '37i9dQZF1DXcBWIGoYBM5M',
    title: "Today's Top Hits",
    description: 'The hottest tracks right now across the globe.',
    thumbnail: 'https://i.scdn.co/image/ab67706f0000000257dd46c764e5c8e31a980c5e',
    genre: 'Top Charts'
  },
  {
    id: '37i9dQZEVXbMDoHDwVN2tF',
    title: 'Top 50 - Global',
    description: 'Your daily update of the most played tracks right now.',
    thumbnail: 'https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_default.jpg',
    genre: 'Global'
  },
  {
    id: '37i9dQZEVXbLiRSasKsNU9',
    title: 'Viral 50 - Global',
    description: 'Your daily update of the most viral tracks right now.',
    thumbnail: 'https://charts-images.scdn.co/assets/locale_en/viral/daily/region_global_default.jpg',
    genre: 'Viral'
  },
  {
    id: '37i9dQZF1DX0XUsuxWHRQd',
    title: 'RapCaviar',
    description: 'New music from Kendrick Lamar, Drake, Travis Scott and more.',
    thumbnail: 'https://i.scdn.co/image/ab67706f000000029b35dbf411baad19db0d4538',
    genre: 'Hip-Hop'
  },
  {
    id: '37i9dQZF1DX4WYpdgoIcn6',
    title: 'Chill Hits',
    description: 'Kick back to the best chill pop and relaxing vibes.',
    thumbnail: 'https://i.scdn.co/image/ab67706f000000021c5f0a0e980387ca63fa3065',
    genre: 'Chill'
  },
  {
    id: '37i9dQZF1DX1lVhptIYRda',
    title: 'Hot Country',
    description: 'Country hits from Nashville and around the world.',
    thumbnail: 'https://i.scdn.co/image/ab67706f000000020d55e84860b642e5a6a0cfac',
    genre: 'Country'
  },
  {
    id: '37i9dQZF1DX4sWSpwq3LiO',
    title: 'Peaceful Piano',
    description: 'Relax and indulge with beautiful piano melodies.',
    thumbnail: 'https://i.scdn.co/image/ab67706f00000002d723e446548773e31e5f8f84',
    genre: 'Focus'
  },
  {
    id: '37i9dQZF1DXa2PvUikemBt',
    title: 'Rock Classics',
    description: 'Rock legends & epic songs that continue to inspire.',
    thumbnail: 'https://i.scdn.co/image/ab67706f000000021b0b57e7935bf79fb81d3326',
    genre: 'Rock'
  }
];
