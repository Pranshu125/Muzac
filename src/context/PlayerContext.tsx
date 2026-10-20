import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Track, Playlist, LyricsData, RadioTunerMode, ViewMode, SoundstageMode } from '../types';
import { extractDominantColor } from '../utils/colorExtractor';

// YouTube Iframe API typings
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  queueIndex: number;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  audioQuality: 'auto' | 'high' | 'lossless';
  playbackSpeed: number;
  isVideoMode: boolean;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  isEQOpen: boolean;
  isFullscreen: boolean;
  likedTracks: Track[];
  downloadedTracks: Track[];
  customPlaylists: Playlist[];
  history: Track[];
  lyrics: LyricsData;
  isLoadingLyrics: boolean;
  primaryColor: string;
  secondaryColor: string;
  sleepTimerMinutes: number | null;
  spatialAudio: boolean;
  eqBands: number[];
  downloadToast: string | null;
  downloadingTrackId: string | null;
  activeRadioMode: RadioTunerMode;
  selectedArtist: string;
  currentView: ViewMode;
  isMasterTechOpen: boolean;
  isDevicePickerOpen: boolean;
  activeDevice: string;
  soundstageMode: SoundstageMode;
  soundCheckEnabled: boolean;
  crossfadeSeconds: number;
  isSmartShuffle: boolean;
  vocalReductionLevel: number;
  isAddToPlaylistOpen: boolean;
  selectedTrackForPlaylist: Track | null;
  playbackStatusMessage: string | null;
  
  // Actions
  setCurrentView: (view: ViewMode) => void;
  setSelectedArtist: (artist: string) => void;
  navigateToArtist: (artist: string) => void;
  applyRadioMode: (mode: RadioTunerMode) => Promise<void>;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setAudioQuality: (q: 'auto' | 'high' | 'lossless') => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsVideoMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  setIsLyricsOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  setIsQueueOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  setIsEQOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  setIsFullscreen: (v: boolean | ((prev: boolean) => boolean)) => void;
  setIsMasterTechOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  setIsDevicePickerOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  setActiveDevice: (device: string) => void;
  setSoundstageMode: (mode: SoundstageMode) => void;
  setSoundCheckEnabled: (enabled: boolean) => void;
  setCrossfadeSeconds: (sec: number) => void;
  toggleSmartShuffle: () => void;
  setVocalReductionLevel: (level: number) => void;
  setIsAddToPlaylistOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  promptAddToPlaylist: (track: Track) => void;
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  downloadTrack: (track: Track) => Promise<void>;
  createPlaylist: (title: string, description?: string, thumbnail?: string, genre?: string) => Playlist;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  deletePlaylist: (playlistId: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  setSleepTimer: (minutes: number | null) => void;
  setEqBandGain: (bandIndex: number, gain: number) => void;
  setSpatialAudio: (enabled: boolean) => void;
  applyEQPreset: (gains: number[]) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session-restored State (Spotify-style persistent session)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => {
    try {
      const saved = localStorage.getItem('muzac_current_track');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return (parsed && parsed.id) ? parsed : null;
    } catch {
      return null;
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('muzac_volume');
      return saved ? parseFloat(saved) : 0.85;
    } catch {
      return 0.85;
    }
  });

  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [queue, setQueue] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('muzac_queue');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((t: any) => t && t.id) : [];
    } catch {
      return [];
    }
  });

  const [queueIndex, setQueueIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('muzac_queue_index');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [isShuffle, setIsShuffle] = useState<boolean>(() => {
    try {
      return localStorage.getItem('muzac_shuffle') === 'true';
    } catch {
      return false;
    }
  });

  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>(() => {
    try {
      const saved = localStorage.getItem('muzac_repeat') as any;
      return ['off', 'all', 'one'].includes(saved) ? saved : 'off';
    } catch {
      return 'off';
    }
  });

  const [audioQuality, setAudioQuality] = useState<'auto' | 'high' | 'lossless'>('high');
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1);
  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isEQOpen, setIsEQOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // Persisted Collections
  const [likedTracks, setLikedTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('muzac_liked');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((t: any) => t && t.id) : [];
    } catch {
      return [];
    }
  });

  const [downloadedTracks, setDownloadedTracks] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('muzac_downloads');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((t: any) => t && t.id) : [];
    } catch {
      return [];
    }
  });

  const [downloadingTrackId, setDownloadingTrackId] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [playbackStatusMessage, setPlaybackStatusMessage] = useState<string | null>(null);

  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('muzac_playlists');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('muzac_history');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((t: any) => t && t.id) : [];
    } catch {
      return [];
    }
  });

  const [lyrics, setLyrics] = useState<LyricsData>({
    syncedLyrics: [],
    plainLyrics: '',
    source: 'none'
  });
  const [isLoadingLyrics, setIsLoadingLyrics] = useState<boolean>(false);

  // Dynamic Monochrome Clay Theme Colors
  const [primaryColor, setPrimaryColor] = useState<string>('rgba(255, 255, 255, 0.12)');
  const [secondaryColor, setSecondaryColor] = useState<string>('rgba(140, 145, 165, 0.08)');

  // Equalizer & Audio processing
  const [eqBands, setEqBands] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [spatialAudio, setSpatialAudio] = useState<boolean>(false);

  // Apple Music & Spotify signature additions
  const [isMasterTechOpen, setIsMasterTechOpen] = useState<boolean>(false);
  const [isDevicePickerOpen, setIsDevicePickerOpen] = useState<boolean>(false);
  const [activeDevice, setActiveDevice] = useState<string>('computer');
  const [soundstageMode, setSoundstageMode] = useState<SoundstageMode>('cinema3d');
  const [soundCheckEnabled, setSoundCheckEnabled] = useState<boolean>(true);
  const [crossfadeSeconds, setCrossfadeSeconds] = useState<number>(3);
  const [isSmartShuffle, setIsSmartShuffle] = useState<boolean>(false);
  const [vocalReductionLevel, setVocalReductionLevel] = useState<number>(0);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState<boolean>(false);
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);

  // Fisher-Yates smart shuffle permutation
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  // Sleep timer
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  // Radio Tuner & Artist Navigation
  const [activeRadioMode, setActiveRadioMode] = useState<RadioTunerMode>('familiar');
  const [selectedArtist, setSelectedArtist] = useState<string>('The Weeknd');
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  // Audio & Player Refs
  const ytPlayerRef = useRef<any>(null);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{
    source?: MediaElementAudioSourceNode;
    filters?: BiquadFilterNode[];
    panner?: StereoPannerNode;
    gainNode?: GainNode;
  }>({});
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const timeUpdateInterval = useRef<any>(null);
  const sleepTimerInterval = useRef<any>(null);
  const hasLookaheadTriggered = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const consecutiveErrorsRef = useRef<number>(0);
  const lastErrorTimeRef = useRef<number>(0);

  // Docking position for in-page Video mode
  const [videoDockRect, setVideoDockRect] = useState<DOMRect | null>(null);

  // Persist key state
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('muzac_current_track', JSON.stringify(currentTrack));
    }
  }, [currentTrack]);

  useEffect(() => {
    localStorage.setItem('muzac_queue', JSON.stringify(queue));
    localStorage.setItem('muzac_queue_index', queueIndex.toString());
  }, [queue, queueIndex]);

  useEffect(() => {
    localStorage.setItem('muzac_volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('muzac_shuffle', isShuffle ? 'true' : 'false');
  }, [isShuffle]);

  useEffect(() => {
    localStorage.setItem('muzac_repeat', repeatMode);
  }, [repeatMode]);

  // Generate Fisher-Yates shuffle array when queue or shuffle changes
  useEffect(() => {
    if (!isShuffle || queue.length === 0) {
      setShuffledIndices([]);
      return;
    }
    const indices = Array.from({ length: queue.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  }, [isShuffle, queue.length]);

  const promptAddToPlaylist = (track: Track) => {
    if (!track || !track.id) return;
    setSelectedTrackForPlaylist(track);
    setIsAddToPlaylistOpen(true);
  };

  const deletePlaylist = (playlistId: string) => {
    setCustomPlaylists(prev => {
      const updated = prev.filter(p => p.id !== playlistId);
      localStorage.setItem('muzac_playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setCustomPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
        }
        return p;
      });
      localStorage.setItem('muzac_playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleSmartShuffle = () => {
    setIsSmartShuffle(prev => !prev);
    if (!isSmartShuffle && currentTrack) {
      fetchRadioAndContinue();
    }
  };

  const navigateToArtist = (artist: string) => {
    setSelectedArtist(artist);
    setCurrentView('artist');
  };

  // Video Dock positioning
  useEffect(() => {
    if (!isVideoMode || !currentTrack) {
      setVideoDockRect(null);
      return;
    }

    const updateDockRect = () => {
      const el = document.getElementById('video-canvas-container');
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setVideoDockRect(rect);
          return;
        }
      }
      setVideoDockRect(null);
    };

    updateDockRect();
    const interval = setInterval(updateDockRect, 100);
    window.addEventListener('resize', updateDockRect);
    window.addEventListener('scroll', updateDockRect, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateDockRect);
      window.removeEventListener('scroll', updateDockRect, true);
    };
  }, [isVideoMode, currentTrack, currentView]);

  // Initialize Local & Web Audio DSP Graph
  useEffect(() => {
    if (!localAudioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      localAudioRef.current = audio;

      audio.onended = () => {
        handleTrackEnd();
      };
      audio.ontimeupdate = () => {
        if (!audio.paused) {
          setCurrentTime(audio.currentTime);
          setDuration(audio.duration || 0);
        }
      };
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onerror = () => {
        console.warn('[Muzac Audio] Local audio error, falling back to YouTube player');
        handlePlaybackError(5);
      };
    }

    return () => {
      if (localAudioRef.current) {
        localAudioRef.current.pause();
      }
    };
  }, []);

  // Initialize YouTube Iframe API with full error recovery (Spotify-grade robustness)
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      initYouTubePlayer();
    };

    if (window.YT && window.YT.Player) {
      initYouTubePlayer();
    }
  }, []);

  const initYouTubePlayer = () => {
    if (ytPlayerRef.current || !document.getElementById('yt-player-container')) return;

    ytPlayerRef.current = new window.YT.Player('yt-player-container', {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        origin: window.location.origin
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(isMuted ? 0 : Math.round(volume * 100));
          event.target.setPlaybackRate(playbackSpeed);
          // If a track was saved in session, cue it
          if (currentTrack && !isPlaying) {
            try {
              event.target.cueVideoById(currentTrack.id);
            } catch {}
          }
        },
        onStateChange: (event: any) => {
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
          if (event.data === 1) {
            setIsPlaying(true);
            setDuration(event.target.getDuration() || 0);
            retryCountRef.current = 0; // reset retry count on successful playback
            consecutiveErrorsRef.current = 0; // reset error circuit breaker
          } else if (event.data === 2) {
            setIsPlaying(false);
          } else if (event.data === 0) {
            handleTrackEnd();
          }
        },
        onError: (event: any) => {
          console.warn('[Muzac Engine] YouTube Player error event code:', event.data);
          handlePlaybackError(event.data);
        }
      }
    });
  };

  // Resilient Error Recovery Engine (Reverse-engineered from Spotify / Spotube)
  const handlePlaybackError = async (errorCode: number) => {
    if (!currentTrack) return;

    const now = Date.now();
    if (now - lastErrorTimeRef.current < 8000) {
      consecutiveErrorsRef.current += 1;
    } else {
      consecutiveErrorsRef.current = 1;
    }
    lastErrorTimeRef.current = now;

    console.warn(`[Muzac Auto-Heal] Handling playback error ${errorCode} (Consecutive: ${consecutiveErrorsRef.current}) for: "${currentTrack.title}"`);
    
    // Circuit breaker: Prevent infinite skipping crash loop if media is blocked or browser is suspending
    if (consecutiveErrorsRef.current >= 3) {
      console.warn('[Muzac Circuit Breaker] Multiple playback errors encountered. Halting automatic skip loop.');
      setIsPlaying(false);
      if (ytPlayerRef.current?.pauseVideo) {
        try { ytPlayerRef.current.pauseVideo(); } catch {}
      }
      setPlaybackStatusMessage('Playback paused due to network or stream restrictions. Tap play to retry.');
      setTimeout(() => setPlaybackStatusMessage(null), 5000);
      return;
    }

    // Attempt 1: Try resolving an official audio alternate upload
    if (retryCountRef.current === 0) {
      retryCountRef.current += 1;
      setPlaybackStatusMessage(`Optimizing stream for "${currentTrack.title}"...`);
      setTimeout(() => setPlaybackStatusMessage(null), 3000);

      try {
        const res = await fetch(`/api/resolve-track?title=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(currentTrack.artist)}`);
        const data = await res.json();
        if (data.track && data.track.id !== currentTrack.id) {
          console.log('[Muzac Auto-Heal] Found alternate verified stream:', data.track.id);
          const altTrack: Track = { ...currentTrack, id: data.track.id };
          setCurrentTrack(altTrack);
          if (ytPlayerRef.current?.loadVideoById) {
            ytPlayerRef.current.loadVideoById(altTrack.id);
            return;
          }
        }
      } catch (err) {
        console.error('Alternate resolution failed:', err);
      }
    }

    // Attempt 2: If alternate also blocked or not available, advance smoothly to next song in queue
    setPlaybackStatusMessage(`Stream restricted by license. Playing next track...`);
    setTimeout(() => setPlaybackStatusMessage(null), 3500);
    retryCountRef.current = 0;
    
    setTimeout(() => {
      nextTrack();
    }, 800);
  };

  // High-precision playback ticker & Spotify-style lookahead pre-fetch
  useEffect(() => {
    if (isPlaying && ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
      timeUpdateInterval.current = setInterval(() => {
        try {
          const t = ytPlayerRef.current.getCurrentTime();
          const d = ytPlayerRef.current.getDuration();
          if (typeof t === 'number') setCurrentTime(t);
          if (typeof d === 'number' && d > 0) setDuration(d);

          // Spotify Lookahead Pre-buffer: pre-fetch next track's lyrics & radio 8s before end
          if (d > 20 && d - t <= 8 && !hasLookaheadTriggered.current) {
            hasLookaheadTriggered.current = true;
            preloadNextTrack();
          }

          // Real Crossfade Volume Ramping
          if (crossfadeSeconds > 0 && d > 15 && d - t <= crossfadeSeconds && d - t > 0) {
            const factor = Math.max(0, (d - t) / crossfadeSeconds);
            const rampedVol = Math.round(volume * factor * 100);
            if (ytPlayerRef.current?.setVolume) {
              ytPlayerRef.current.setVolume(rampedVol);
            }
          }
        } catch {}
      }, 250);
    } else {
      if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
    }

    return () => {
      if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
    };
  }, [isPlaying, volume, crossfadeSeconds, duration]);

  // Preload next track metadata & lyrics for gapless transition
  const preloadNextTrack = () => {
    const nextIdx = queueIndex + 1;
    if (queue[nextIdx]) {
      const nextSong = queue[nextIdx];
      // Pre-fetch lyrics in background
      fetch(`/api/lyrics?title=${encodeURIComponent(nextSong.title)}&artist=${encodeURIComponent(nextSong.artist)}&duration=${nextSong.duration || 0}`).catch(() => {});
    }
  };

  // Handle Track Completion
  const handleTrackEnd = () => {
    hasLookaheadTriggered.current = false;

    // Reset volume after crossfade
    if (ytPlayerRef.current?.setVolume) {
      ytPlayerRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
    }

    if (repeatMode === 'one') {
      seekTo(0);
      play();
      return;
    }

    if (queue.length > 0 && queueIndex < queue.length - 1) {
      nextTrack();
    } else if (repeatMode === 'all' && queue.length > 0) {
      setQueueIndex(0);
      playTrack(queue[0]);
    } else {
      // Autoplay Radio & Smart Shuffle
      fetchRadioAndContinue();
    }
  };

  // Autoplay radio recommendations when queue finishes
  const fetchRadioAndContinue = async () => {
    if (!currentTrack) return;
    try {
      const res = await fetch(`/api/radio?id=${currentTrack.id}&title=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(currentTrack.artist)}&mode=${activeRadioMode}`);
      const data = await res.json();
      if (data.tracks && data.tracks.length > 0) {
        setQueue(prev => [...prev, ...data.tracks]);
        setQueueIndex(prev => prev + 1);
        playTrack(data.tracks[0]);
      } else {
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  // Re-tune queue based on YTM Radio Tuner modes
  const applyRadioMode = async (mode: RadioTunerMode) => {
    if (!currentTrack) return;
    setActiveRadioMode(mode);
    try {
      const res = await fetch(`/api/radio?id=${currentTrack.id}&title=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(currentTrack.artist)}&mode=${mode}`);
      const data = await res.json();
      if (data.tracks && data.tracks.length > 0) {
        setQueue(prev => {
          const currentPart = prev.slice(0, queueIndex + 1);
          return [...currentPart, ...data.tracks];
        });
      }
    } catch (err) {
      console.error('Radio tuner error:', err);
    }
  };

  // Play a specific track
  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (!track || !track.id) {
      console.warn('[Muzac] Cannot play invalid or undefined track');
      return;
    }

    hasLookaheadTriggered.current = false;
    retryCountRef.current = 0;
    consecutiveErrorsRef.current = 0;
    setCurrentTrack(track);
    setCurrentTime(0);

    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else if (!queue.some(t => t.id === track.id)) {
      setQueue(prev => [...prev, track]);
      setQueueIndex(queue.length);
    } else {
      const idx = queue.findIndex(t => t.id === track.id);
      if (idx >= 0) setQueueIndex(idx);
    }

    // Add to History
    setHistory(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      const updated = [track, ...filtered].slice(0, 50);
      localStorage.setItem('muzac_history', JSON.stringify(updated));
      return updated;
    });

    // Dynamic color extraction
    if (track.thumbnail) {
      extractDominantColor(track.thumbnail).then(({ primary, secondary }) => {
        setPrimaryColor(primary);
        setSecondaryColor(secondary);
      });
    }

    // Fetch Lyrics
    fetchLyrics(track);

    // Audio routing
    if (track.isLocal && track.audioUrl) {
      if (ytPlayerRef.current?.pauseVideo) {
        try { ytPlayerRef.current.pauseVideo(); } catch {}
      }
      if (localAudioRef.current) {
        localAudioRef.current.src = track.audioUrl;
        localAudioRef.current.volume = isMuted ? 0 : volume;
        localAudioRef.current.playbackRate = playbackSpeed;
        localAudioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    } else {
      if (localAudioRef.current) {
        localAudioRef.current.pause();
      }
      if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
        try {
          ytPlayerRef.current.loadVideoById(track.id);
          ytPlayerRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
          ytPlayerRef.current.setPlaybackRate(playbackSpeed);
          setIsPlaying(true);
        } catch (err) {
          console.error('Failed to load video into YT player:', err);
        }
      } else {
        setTimeout(() => {
          if (ytPlayerRef.current?.loadVideoById) {
            ytPlayerRef.current.loadVideoById(track.id);
            setIsPlaying(true);
          }
        }, 500);
      }
    }
  };

  const fetchLyrics = async (track: Track) => {
    setIsLoadingLyrics(true);
    try {
      const res = await fetch(`/api/lyrics?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}&duration=${track.duration || 0}`);
      const data = await res.json();
      setLyrics(data);
    } catch {
      setLyrics({
        syncedLyrics: [],
        plainLyrics: 'Lyrics unavailable for this track.',
        source: 'none'
      });
    } finally {
      setIsLoadingLyrics(false);
    }
  };

  const play = () => {
    if (currentTrack?.isLocal && localAudioRef.current) {
      localAudioRef.current.play();
      setIsPlaying(true);
    } else if (ytPlayerRef.current?.playVideo) {
      ytPlayerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (currentTrack?.isLocal && localAudioRef.current) {
      localAudioRef.current.pause();
      setIsPlaying(false);
    } else if (ytPlayerRef.current?.pauseVideo) {
      ytPlayerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (currentTrack?.isLocal && localAudioRef.current) {
      localAudioRef.current.currentTime = seconds;
    } else if (ytPlayerRef.current?.seekTo) {
      ytPlayerRef.current.seekTo(seconds, true);
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    setIsMuted(false);
    if (localAudioRef.current) {
      localAudioRef.current.volume = clamped;
    }
    if (ytPlayerRef.current?.setVolume) {
      ytPlayerRef.current.setVolume(Math.round(clamped * 100));
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (localAudioRef.current) {
      localAudioRef.current.volume = nextMuted ? 0 : volume;
    }
    if (ytPlayerRef.current?.setVolume) {
      ytPlayerRef.current.setVolume(nextMuted ? 0 : Math.round(volume * 100));
    }
  };

  // Spotify-style Smart Next Track (Fisher-Yates aware)
  const nextTrack = () => {
    if (queue.length === 0) return;

    if (isShuffle && shuffledIndices.length === queue.length) {
      const currentPosInShuffle = shuffledIndices.indexOf(queueIndex);
      const nextPos = (currentPosInShuffle + 1) % shuffledIndices.length;
      const targetIdx = shuffledIndices[nextPos];
      setQueueIndex(targetIdx);
      playTrack(queue[targetIdx]);
      return;
    }

    const nextIdx = queueIndex + 1;
    if (nextIdx < queue.length) {
      setQueueIndex(nextIdx);
      playTrack(queue[nextIdx]);
    } else if (repeatMode === 'all') {
      setQueueIndex(0);
      playTrack(queue[0]);
    } else {
      fetchRadioAndContinue();
    }
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    if (isShuffle && shuffledIndices.length === queue.length) {
      const currentPosInShuffle = shuffledIndices.indexOf(queueIndex);
      const prevPos = currentPosInShuffle > 0 ? currentPosInShuffle - 1 : shuffledIndices.length - 1;
      const targetIdx = shuffledIndices[prevPos];
      setQueueIndex(targetIdx);
      playTrack(queue[targetIdx]);
      return;
    }

    if (queueIndex > 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      playTrack(queue[prevIdx]);
    } else {
      seekTo(0);
    }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (localAudioRef.current) localAudioRef.current.playbackRate = speed;
    if (ytPlayerRef.current?.setPlaybackRate) ytPlayerRef.current.setPlaybackRate(speed);
  };

  // Like / Favorite system
  const toggleLike = (track: Track) => {
    if (!track || !track.id) return;
    setLikedTracks(prev => {
      const exists = prev.some(t => t.id === track.id);
      let updated: Track[];
      if (exists) {
        updated = prev.filter(t => t.id !== track.id);
      } else {
        updated = [track, ...prev];
      }
      localStorage.setItem('muzac_liked', JSON.stringify(updated));
      return updated;
    });
  };

  const isLiked = (trackId?: string) => {
    if (!trackId) return false;
    return likedTracks.some(t => t.id === trackId);
  };

  // Playlists
  const createPlaylist = (title: string, description: string = '', thumbnail?: string, genre?: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      title,
      description,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      genre: genre || 'Custom',
      tracks: [],
      isCustom: true
    };
    setCustomPlaylists(prev => {
      const updated = [...prev, newPl];
      localStorage.setItem('muzac_playlists', JSON.stringify(updated));
      return updated;
    });
    return newPl;
  };

  const updatePlaylist = (playlistId: string, updates: Partial<Playlist>) => {
    setCustomPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, ...updates };
        }
        return p;
      });
      localStorage.setItem('muzac_playlists', JSON.stringify(updated));
      return updated;
    });
  };

  const addToPlaylist = (playlistId: string, track: Track) => {
    setCustomPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id === playlistId && !p.tracks.some(t => t.id === track.id)) {
          return { ...p, tracks: [...p.tracks, track] };
        }
        return p;
      });
      localStorage.setItem('muzac_playlists', JSON.stringify(updated));
      return updated;
    });
  };

  // Sleep Timer
  const setSleepTimer = (minutes: number | null) => {
    if (sleepTimerInterval.current) clearInterval(sleepTimerInterval.current);
    setSleepTimerMinutes(minutes);

    if (minutes && minutes > 0) {
      let remainingSeconds = minutes * 60;
      sleepTimerInterval.current = setInterval(() => {
        remainingSeconds -= 1;
        if (remainingSeconds <= 0) {
          clearInterval(sleepTimerInterval.current);
          setSleepTimerMinutes(null);
          pause();
        }
      }, 1000);
    }
  };

  // Equalizer
  const setEqBandGain = (bandIndex: number, gain: number) => {
    setEqBands(prev => {
      const next = [...prev];
      next[bandIndex] = Math.max(-12, Math.min(12, gain));
      return next;
    });
  };

  const applyEQPreset = (gains: number[]) => {
    setEqBands(gains);
  };

  // Global Keyboard Shortcuts (Input-Safe)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Do not intercept keystrokes when typing in inputs or textareas
      if (
        target instanceof HTMLInputElement || 
        target instanceof HTMLTextAreaElement || 
        target?.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        nextTrack();
      } else if (e.code === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        prevTrack();
      } else if (e.code === 'ArrowRight') {
        seekTo(Math.min(duration, currentTime + 5));
      } else if (e.code === 'ArrowLeft') {
        seekTo(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(volume - 0.05);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'l' || e.key === 'L') {
        setIsLyricsOpen(prev => !prev);
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsQueueOpen(prev => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        toggleShuffle();
      } else if (e.key === 'r' || e.key === 'R') {
        toggleRepeat();
      } else if (e.key === 'v' || e.key === 'V') {
        setIsVideoMode(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration, volume, isMuted, queue, queueIndex]);

  const skipForward = (secs: number = 15) => {
    seekTo(Math.min(duration, currentTime + secs));
  };

  const skipBackward = (secs: number = 15) => {
    seekTo(Math.max(0, currentTime - secs));
  };

  const downloadTrack = async (track: Track) => {
    if (!track || !track.id) return;
    try {
      setDownloadingTrackId(track.id);
      setDownloadToast(`Downloading "${track.title}" in Master Audio...`);

      const downloadUrl = `/api/download/${track.id}?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${track.artist} - ${track.title}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadedTracks(prev => {
        const filtered = prev.filter(t => t.id !== track.id);
        const updated = [track, ...filtered];
        localStorage.setItem('muzac_downloads', JSON.stringify(updated));
        return updated;
      });

      setTimeout(() => {
        setDownloadingTrackId(null);
        setDownloadToast(`Saved "${track.title}" to your computer!`);
        setTimeout(() => setDownloadToast(null), 3500);
      }, 1500);
    } catch {
      setDownloadingTrackId(null);
      setDownloadToast('Download failed. Try again.');
      setTimeout(() => setDownloadToast(null), 3000);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        queue,
        queueIndex,
        isShuffle,
        repeatMode,
        audioQuality,
        playbackSpeed,
        isVideoMode,
        isLyricsOpen,
        isQueueOpen,
        isEQOpen,
        isFullscreen,
        likedTracks,
        downloadedTracks,
        customPlaylists,
        history,
        lyrics,
        isLoadingLyrics,
        primaryColor,
        secondaryColor,
        sleepTimerMinutes,
        spatialAudio,
        eqBands,
        downloadToast,
        downloadingTrackId,
        activeRadioMode,
        selectedArtist,
        setSelectedArtist,
        currentView,
        setCurrentView,
        navigateToArtist,
        applyRadioMode,
        playTrack,
        togglePlay,
        seekTo,
        setVolume,
        toggleMute,
        nextTrack,
        prevTrack,
        skipForward,
        skipBackward,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleShuffle,
        toggleRepeat,
        setAudioQuality,
        setPlaybackSpeed,
        setIsVideoMode,
        setIsLyricsOpen,
        setIsQueueOpen,
        setIsEQOpen,
        setIsFullscreen,
        toggleLike,
        isLiked,
        downloadTrack,
        createPlaylist,
        updatePlaylist,
        addToPlaylist,
        deletePlaylist,
        removeFromPlaylist,
        setSleepTimer,
        setEqBandGain,
        setSpatialAudio,
        applyEQPreset,
        isMasterTechOpen,
        setIsMasterTechOpen,
        isDevicePickerOpen,
        setIsDevicePickerOpen,
        activeDevice,
        setActiveDevice,
        soundstageMode,
        setSoundstageMode,
        soundCheckEnabled,
        setSoundCheckEnabled,
        crossfadeSeconds,
        setCrossfadeSeconds,
        isSmartShuffle,
        toggleSmartShuffle,
        vocalReductionLevel,
        setVocalReductionLevel,
        isAddToPlaylistOpen,
        setIsAddToPlaylistOpen,
        selectedTrackForPlaylist,
        promptAddToPlaylist,
        playbackStatusMessage
      }}
    >
      {/* Container for YouTube Player: Kept in-viewport with 0.01 opacity in audio mode to prevent iOS Safari & Android WebKit from suspending background audio playback; docks cleanly into VideoPlayerView when in video mode */}
      <div 
        ref={ytContainerRef}
        style={{
          position: 'fixed',
          top: isVideoMode && currentTrack && videoDockRect ? `${videoDockRect.top}px` : 'auto',
          left: isVideoMode && currentTrack && videoDockRect ? `${videoDockRect.left}px` : 'auto',
          bottom: isVideoMode && currentTrack && videoDockRect ? 'auto' : '0px',
          right: isVideoMode && currentTrack && videoDockRect ? 'auto' : '0px',
          width: isVideoMode && currentTrack && videoDockRect ? `${videoDockRect.width}px` : '240px',
          height: isVideoMode && currentTrack && videoDockRect ? `${videoDockRect.height}px` : '180px',
          pointerEvents: isVideoMode && currentTrack && videoDockRect ? 'auto' : 'none',
          zIndex: isVideoMode && currentTrack && videoDockRect ? 15 : -1,
          opacity: isVideoMode && currentTrack && videoDockRect ? 1 : 0.01,
          borderRadius: isVideoMode && currentTrack && videoDockRect ? '1.5rem' : '0px',
          overflow: 'hidden',
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <div id="yt-player-container" style={{ width: '100%', height: '100%' }} />
      </div>

      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};
