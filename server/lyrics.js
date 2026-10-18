import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import axios from 'axios';

// In-memory lyrics cache to prevent rate-limiting and achieve 0ms instant display
const lyricsCache = new Map();

// Parse LRC formatted string into structured array with millisecond precision
export function parseLRC(lrcString) {
  if (!lrcString) return [];
  const lines = lrcString.split('\n');
  const result = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.?(\d{2,3})?\](.*)/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millisPart = match[3] || '0';
      const millis = millisPart.length === 2 ? parseInt(millisPart, 10) * 10 : parseInt(millisPart, 10);
      const timeInSeconds = minutes * 60 + seconds + millis / 1000;
      const text = match[4].trim();
      
      if (text) {
        result.push({
          time: timeInSeconds,
          text
        });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

// Fetch synced and plain lyrics from LRCLIB with in-memory caching
export async function getLyrics(trackName, artistName, duration) {
  if (!trackName) return { syncedLyrics: [], plainLyrics: '', source: 'none' };

  // Clean track name (remove feat., (Official Music Video), (Audio), etc.)
  const cleanTrackName = trackName
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/ft\..*|feat\..*/i, '')
    .replace(/official\s+video|official\s+audio|lyrics/i, '')
    .trim();

  const cleanArtist = (artistName || '')
    .replace(/,\s*.*$/, '')
    .replace(/\s+-\s+topic$/i, '')
    .replace(/vevo$/i, '')
    .trim();

  const cacheKey = `${cleanTrackName.toLowerCase()}:::${cleanArtist.toLowerCase()}`;
  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey);
  }

  try {
    // 1. Try exact match
    const params = {
      track_name: cleanTrackName,
      artist_name: cleanArtist
    };
    if (duration) params.duration = Math.round(duration);

    const res = await axios.get('https://lrclib.net/api/get', {
      params,
      timeout: 4000,
      headers: {
        'User-Agent': 'Muzac/1.0.0 (https://github.com/rawnaldclark/Stash)'
      }
    });

    if (res.data) {
      const result = {
        id: res.data.id,
        trackName: res.data.trackName,
        artistName: res.data.artistName,
        syncedLyrics: parseLRC(res.data.syncedLyrics),
        rawLRC: res.data.syncedLyrics || '',
        plainLyrics: res.data.plainLyrics || '',
        source: 'lrclib'
      };
      lyricsCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    // Fall back to search
  }

  try {
    // 2. Try search fallback
    const searchRes = await axios.get('https://lrclib.net/api/search', {
      params: { q: `${cleanTrackName} ${cleanArtist}`.trim() },
      timeout: 4000,
      headers: {
        'User-Agent': 'Muzac/1.0.0 (https://github.com/rawnaldclark/Stash)'
      }
    });

    if (searchRes.data && searchRes.data.length > 0) {
      const best = searchRes.data.find(item => item.syncedLyrics) || searchRes.data[0];
      const result = {
        id: best.id,
        trackName: best.trackName,
        artistName: best.artistName,
        syncedLyrics: parseLRC(best.syncedLyrics),
        rawLRC: best.syncedLyrics || '',
        plainLyrics: best.plainLyrics || '',
        source: 'lrclib'
      };
      lyricsCache.set(cacheKey, result);
      return result;
    }
  } catch (searchErr) {
    // Don't log spam on expected network timeouts
  }

  const fallbackResult = {
    syncedLyrics: [],
    plainLyrics: 'Lyrics unavailable for this track.',
    source: 'none'
  };
  return fallbackResult;
}
