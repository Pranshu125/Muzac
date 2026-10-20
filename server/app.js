import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import axios from 'axios';
import { 
  searchTracks, 
  getRadioTracks, 
  getArtistProfile,
  getTrendingVideos,
  TRENDING_MUSIC_VIDEOS,
  CITY_CHARTS,
  FEATURED_TRENDING_TRACKS, 
  MOODS_AND_GENRES 
} from './ytmusic.js';
import { getSpotifyData, CURATED_SPOTIFY_PLAYLISTS } from './spotify.js';
import { getLyrics } from './lyrics.js';
import { FEATURED_PODCASTS, PODCAST_CATEGORIES } from './podcasts.js';
import { registerUser, loginUser, getUserByToken } from './auth.js';
import { SPOTIFY_TOP_50, APPLE_MUSIC_HITS, YOUTUBE_TRENDING, BILLBOARD_HOT_100 } from './trending.js';

const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

// Root API discovery endpoint
apiRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Muzac Hi-Fi Music Engine',
    version: '2.0.0',
    platform: process.env.VERCEL ? 'vercel-serverless' : 'node-local',
    endpoints: [
      '/api/health',
      '/api/ping',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/trending',
      '/api/home',
      '/api/search',
      '/api/podcasts',
      '/api/city-charts',
      '/api/spotify/featured',
      '/api/videos/trending',
      '/api/lyrics',
      '/api/radio'
    ]
  });
});

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Muzac Backend is online', platform: process.env.VERCEL ? 'vercel-serverless' : 'node-local', timestamp: Date.now() });
});

// Ping endpoint for instant telemetry
apiRouter.get('/ping', (req, res) => {
  res.json({ pong: true, timestamp: Date.now() });
});

// Contact & Feedback submission (Working contact form & song requests)
apiRouter.post(['/contact', '/feedback'], (req, res) => {
  const { category = 'general', name = 'Anonymous Listener', email = '', subject = 'Feedback', message = '' } = req.body || {};
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Feedback message cannot be empty' });
  }

  const feedbackEntry = {
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    category,
    name: String(name).slice(0, 80),
    email: String(email).slice(0, 120),
    subject: String(subject).slice(0, 150),
    message: String(message).slice(0, 2000),
    timestamp: new Date().toISOString()
  };

  console.log('[Muzac Feedback Received]', feedbackEntry);
  res.json({
    success: true,
    message: 'Your feedback has been securely recorded. Thank you for supporting Muzac!',
    id: feedbackEntry.id
  });
});

// Authentication Endpoints
apiRouter.post('/auth/register', (req, res) => {
  try {
    const { username, email, password, displayName, avatar } = req.body || {};
    const result = registerUser({ username, email, password, displayName, avatar });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.post('/auth/login', (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body || {};
    const result = loginUser({ usernameOrEmail, password });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

apiRouter.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized or session expired' });
  }
  res.json({ success: true, user });
});

// Multi-Platform Trending Engine: Spotify, Apple Music, YouTube Music, Billboard
apiRouter.get('/trending', (req, res) => {
  const { source = 'all' } = req.query;
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
  
  if (source === 'spotify') {
    return res.json({ source: 'spotify', tracks: SPOTIFY_TOP_50 });
  }
  if (source === 'apple') {
    return res.json({ source: 'apple', tracks: APPLE_MUSIC_HITS });
  }
  if (source === 'youtube') {
    return res.json({ source: 'youtube', tracks: YOUTUBE_TRENDING });
  }
  if (source === 'billboard') {
    return res.json({ source: 'billboard', tracks: BILLBOARD_HOT_100 });
  }

  // Combined all sources
  res.json({
    source: 'all',
    spotify: SPOTIFY_TOP_50,
    apple: APPLE_MUSIC_HITS,
    youtube: YOUTUBE_TRENDING,
    billboard: BILLBOARD_HOT_100,
    all: [
      ...SPOTIFY_TOP_50.slice(0, 4),
      ...APPLE_MUSIC_HITS.slice(0, 4),
      ...YOUTUBE_TRENDING.slice(0, 4),
      ...BILLBOARD_HOT_100.slice(0, 4)
    ]
  });
});

// Home feed: Featured tracks, Curated Spotify playlists, Moods & Genres
apiRouter.get('/home', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
  res.json({
    featuredTracks: FEATURED_TRENDING_TRACKS,
    curatedPlaylists: CURATED_SPOTIFY_PLAYLISTS,
    moods: MOODS_AND_GENRES
  });
});

// Search tracks, artists, videos, and podcasts
apiRouter.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) {
      return res.json({ results: [] });
    }
    const results = await searchTracks(q, type || 'all');
    res.json({ results });
  } catch (err) {
    console.error('Search API error:', err.message);
    res.json({ results: [] });
  }
});

// Autoplay / Radio Queue with YTM Tuner modes
apiRouter.get('/radio', async (req, res) => {
  try {
    const { id, title, artist, mode } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Track id is required' });
    }
    const radioTracks = await getRadioTracks(id, title, artist, mode || 'familiar');
    res.json({ tracks: radioTracks });
  } catch (err) {
    console.error('Radio API error:', err);
    res.status(500).json({ error: 'Radio generation failed', details: err.message });
  }
});

// Artist Profile (Top songs, Discography, Music Videos, Related Artists)
apiRouter.get('/artist/:name', async (req, res) => {
  try {
    const artist = await getArtistProfile(req.params.name);
    if (artist) {
      res.json(artist);
    } else {
      res.status(404).json({ error: 'Artist not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apple Music City Charts (Top 100 Tokyo, NY, London, Paris, Seoul, LA, etc.)
apiRouter.get('/city-charts', (req, res) => {
  res.json({ charts: CITY_CHARTS });
});

// Trending Music Videos Hub (4K / 1080p Ultra HD)
apiRouter.get('/videos/trending', async (req, res) => {
  try {
    const { genre } = req.query;
    const videos = await getTrendingVideos(genre || 'all');
    res.json({ videos });
  } catch (err) {
    console.error('Videos endpoint error:', err);
    res.json({ videos: TRENDING_MUSIC_VIDEOS });
  }
});

// Lyrics: Time-synced & Plain
apiRouter.get('/lyrics', async (req, res) => {
  try {
    const { title, artist, duration } = req.query;
    const lyricsData = await getLyrics(title, artist, duration ? parseFloat(duration) : undefined);
    res.json(lyricsData);
  } catch (err) {
    console.error('Lyrics API error:', err);
    res.status(500).json({ error: 'Lyrics fetch failed', details: err.message });
  }
});

// Spotify Import / Details
apiRouter.post('/spotify/import', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Spotify URL or ID is required' });
    }
    const playlistData = await getSpotifyData(url);
    res.json(playlistData);
  } catch (err) {
    console.error('Spotify import error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get Curated Spotify Playlists
apiRouter.get('/spotify/featured', (req, res) => {
  res.json({ playlists: CURATED_SPOTIFY_PLAYLISTS });
});

// Podcasts Catalog
apiRouter.get('/podcasts', (req, res) => {
  res.json({
    categories: PODCAST_CATEGORIES,
    podcasts: FEATURED_PODCASTS
  });
});

// Resolve a Spotify track (Title + Artist) to a playable YouTube track ID
apiRouter.get('/resolve-track', async (req, res) => {
  try {
    const { title, artist } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }
    const query = `${title} ${artist || ''} official audio`.trim();
    const results = await searchTracks(query, 'song');
    if (results.length > 0) {
      res.json({ track: results[0] });
    } else {
      res.status(404).json({ error: 'Track not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Direct In-App Audio Download Endpoint (Zero Redirects!)
apiRouter.get('/download/:id', async (req, res) => {
  const { id } = req.params;
  const { title = 'Track', artist = 'Artist' } = req.query;

  const cleanFilename = `${artist} - ${title}`.replace(/[\\/*?:"<>|]/g, '_').trim();

  exec(`python -m yt_dlp -g "https://www.youtube.com/watch?v=${id}" -f "ba"`, async (err, stdout) => {
    if (err) {
      // Graceful fallback for cloud/serverless environments without python
      return res.status(200).json({ 
        directPlayOnly: true, 
        message: 'Direct offline download requires local Python yt-dlp environment. Playback is streaming seamlessly inside app.' 
      });
    }

    const lines = stdout.trim().split('\n').filter(l => l.startsWith('http'));
    const streamUrl = lines[0];

    if (!streamUrl) {
      return res.status(404).json({ error: 'Audio stream URL not found' });
    }

    try {
      const audioStream = await axios.get(streamUrl, { responseType: 'stream' });
      
      const contentType = audioStream.headers['content-type'] || 'audio/webm';
      const extension = contentType.includes('mp4') || contentType.includes('m4a') ? 'm4a' : 'webm';

      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(cleanFilename)}.${extension}"`);
      res.setHeader('Content-Type', contentType);
      if (audioStream.headers['content-length']) {
        res.setHeader('Content-Length', audioStream.headers['content-length']);
      }

      audioStream.data.pipe(res);
    } catch (streamErr) {
      console.error('Error piping stream:', streamErr);
      res.status(500).json({ error: 'Failed to stream audio file' });
    }
  });
});

// Dual mount: handles both /api/* (Vercel & local) and direct /* (some Vercel rewrite versions)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Global Express error handler to prevent raw 500 HTML crashes
app.use((err, req, res, next) => {
  console.error('Muzac Express Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err?.message || 'An unexpected error occurred in backend services'
  });
});

export default app;
