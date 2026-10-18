import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Music, 
  Maximize2, 
  Play, 
  Pause,
  Heart, 
  Download, 
  ListPlus, 
  Mic2, 
  CheckCircle2, 
  Flame, 
  Tv, 
  TrendingUp,
  Disc3,
  Plus,
  Share2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types';

export const VideoPlayerView: React.FC = () => {
  const { 
    currentTrack, 
    setIsVideoMode, 
    isPlaying, 
    togglePlay, 
    playTrack,
    addToQueue,
    toggleLike,
    isLiked,
    downloadTrack,
    downloadingTrackId,
    setIsLyricsOpen,
    navigateToArtist,
    queue,
    promptAddToPlaylist
  } = usePlayer();

  const [trendingVideos, setTrendingVideos] = useState<Track[]>([]);
  const [artistVideos, setArtistVideos] = useState<Track[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`/api/videos/trending?genre=${encodeURIComponent(selectedGenre)}`);
        const data = await res.json();
        if (data.videos) {
          setTrendingVideos(data.videos);
        }
      } catch (err) {
        console.error('Failed to fetch trending videos:', err);
      }
    };
    fetchVideos();
  }, [selectedGenre]);

  useEffect(() => {
    if (!currentTrack?.artist) return;
    const fetchArtistVids = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(currentTrack.artist + ' official music video')}&type=video`);
        const data = await res.json();
        if (data.results) {
          setArtistVideos(data.results.filter((v: Track) => v.id !== currentTrack.id).slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to fetch artist videos:', err);
      }
    };
    fetchArtistVids();
  }, [currentTrack?.artist, currentTrack?.id]);

  const handleCopyShare = () => {
    if (currentTrack) {
      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${currentTrack.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleFullscreenVideo = () => {
    const dock = document.getElementById('video-canvas-container');
    if (dock) {
      if (!document.fullscreenElement) {
        dock.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const genres = [
    { id: 'all', label: 'All Hits' },
    { id: 'pop', label: 'Pop' },
    { id: 'hip-hop', label: 'Hip-Hop' },
    { id: 'r&b', label: 'R&B' },
    { id: 'rock', label: 'Rock' },
    { id: 'edm', label: 'Electronic' },
    { id: 'k-pop', label: 'K-Pop' }
  ];

  // VIEW A: If NO Track is Selected
  if (!currentTrack) {
    const heroVideo = trendingVideos[0] || {
      id: 'fHI8X4OXluQ',
      title: 'Blinding Lights (Official Music Video)',
      artist: 'The Weeknd',
      durationFormatted: '4:20',
      views: '2.8B views',
      thumbnail: 'https://i.ytimg.com/vi/fHI8X4OXluQ/maxresdefault.jpg'
    };

    return (
      <div className="p-8 space-y-10 select-none max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl clay-pill flex items-center justify-center text-white border border-white/20">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight m-0 flex items-center gap-2">
                <span>Music Videos</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black clay-btn-white uppercase">
                  4K Ultra HD
                </span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5 m-0">
                Stream official cinematic music videos and visual premieres
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVideoMode(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl clay-pill text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Switch to Audio</span>
          </button>
        </div>

        {/* Hero Spotlight Video Premiere Billboard */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group clay-panel-deep">
          <img
            src={heroVideo.thumbnail}
            alt={heroVideo.title}
            className="w-full h-80 lg:h-96 object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8 lg:p-12">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-xl clay-btn-white text-[11px] font-black uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Global Video Premiere
                </span>
                <span className="px-2.5 py-1 rounded-lg clay-pill text-white text-[10px] font-bold">
                  4K UHD
                </span>
                <span className="px-2.5 py-1 rounded-lg clay-pill text-zinc-300 text-[10px] font-bold">
                  Spatial Audio
                </span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md m-0">
                {heroVideo.title}
              </h2>
              <p className="text-sm lg:text-base text-zinc-300 font-bold m-0 flex items-center gap-2">
                <span>{heroVideo.artist}</span>
                <span>&bull;</span>
                <span className="text-zinc-500">{heroVideo.views}</span>
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsVideoMode(true);
                    playTrack(heroVideo);
                  }}
                  className="px-6 py-3 rounded-2xl clay-btn-white font-black text-sm flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Watch &amp; Listen Now</span>
                </button>
                <button
                  onClick={() => promptAddToPlaylist(heroVideo)}
                  className="p-3 rounded-2xl clay-pill text-white hover:border-white/30 transition"
                  title="Add to Playlist"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Genre & Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
          {genres.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedGenre === g.id
                  ? 'clay-btn-white'
                  : 'clay-pill text-zinc-400 hover:text-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Trending Music Videos Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-white" />
              <h3 className="text-lg font-black text-white tracking-tight m-0">
                Trending Global 4K Music Videos
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-bold">Updated Daily</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {trendingVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setIsVideoMode(true);
                  playTrack(video);
                }}
                className="clay-card p-3.5 rounded-3xl cursor-pointer group hover:border-white/30 transition-all duration-300"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 mb-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full clay-btn-white flex items-center justify-center shadow-2xl">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg clay-inset text-[10px] font-mono font-bold text-white">
                    {video.durationFormatted || 'HD'}
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg clay-btn-white text-[9px] font-black uppercase">
                    {video.resolution || '4K UHD'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-zinc-200 transition m-0">
                      {video.title}
                    </h4>
                    <p 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToArtist(video.artist);
                      }}
                      className="text-[11px] text-zinc-400 truncate mt-1 hover:text-white hover:underline m-0"
                    >
                      {video.artist}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      promptAddToPlaylist(video);
                    }}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 clay-pill text-zinc-400 hover:text-white"
                    title="Add to Playlist"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW B: When a Video is Playing
  const liked = isLiked(currentTrack.id);
  const isDownloading = downloadingTrackId === currentTrack.id;

  return (
    <div className={`p-6 lg:p-8 space-y-6 select-none mx-auto transition-all duration-300 ${isTheaterMode ? 'max-w-full px-4' : 'max-w-6xl'}`}>
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl clay-pill flex items-center justify-center text-white border border-white/20">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight m-0">
              {currentTrack.title}
            </h2>
            <p 
              onClick={() => navigateToArtist(currentTrack.artist)}
              className="text-xs text-zinc-400 mt-0.5 m-0 hover:text-white hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentTrack.artist}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span>Official 4K Music Video</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTheaterMode(prev => !prev)}
            className={`p-2 px-3 rounded-2xl clay-pill transition text-xs font-bold flex items-center gap-1.5 ${
              isTheaterMode ? 'bg-white text-black font-extrabold' : 'text-zinc-300 hover:text-white'
            }`}
            title="Toggle Theater Mode"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">{isTheaterMode ? 'Standard' : 'Theater'}</span>
          </button>

          <button
            onClick={handleFullscreenVideo}
            className="p-2 rounded-2xl clay-pill text-zinc-300 hover:text-white transition"
            title="Fullscreen Video"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsVideoMode(false)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl clay-pill text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Switch to Audio</span>
          </button>
        </div>
      </div>

      {/* Main Video Cinema Frame */}
      <div className="relative group">
        <div 
          id="video-canvas-container" 
          className="relative aspect-video w-full rounded-3xl overflow-hidden clay-panel-deep border border-white/20 shadow-2xl bg-black"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -z-10 bg-[#08090f]">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin opacity-50 mb-2" />
            <span className="text-[11px] font-mono text-zinc-500">Loading Bit-Perfect 4K Video...</span>
          </div>
        </div>
      </div>

      {/* Video Details Bar */}
      <div className="clay-panel rounded-3xl p-5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toggleLike(currentTrack)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl clay-pill text-xs font-bold transition ${
              liked ? 'bg-white text-black font-extrabold' : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-black' : ''}`} />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            onClick={() => promptAddToPlaylist(currentTrack)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl clay-pill text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Playlist</span>
          </button>

          <button
            onClick={() => downloadTrack(currentTrack)}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl clay-pill text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Saving...' : 'Download MP3'}</span>
          </button>

          <button
            onClick={() => setIsLyricsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl clay-pill text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            <Mic2 className="w-4 h-4" />
            <span>Lyrics</span>
          </button>

          <button
            onClick={handleCopyShare}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl clay-pill text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl clay-pill text-white text-[11px] font-black uppercase">
            4K UHD / 1080p
          </span>
          <span className="px-3 py-1 rounded-xl clay-btn-white text-[11px] font-black uppercase">
            ALAC Hi-Res Audio
          </span>
        </div>
      </div>

      {/* Up Next & Artist Video Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Next in Queue */}
        <div className="clay-card p-5 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white tracking-tight uppercase m-0 flex items-center gap-2">
              <Layers className="w-4 h-4 text-white" />
              <span>Up Next in Video</span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-bold">{queue.length} in queue</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
            {queue.slice(1, 6).map((item, idx) => (
              <div
                key={item.id + idx}
                onClick={() => playTrack(item)}
                className="flex items-center gap-3 p-2.5 rounded-2xl clay-pill hover:border-white/30 transition cursor-pointer group"
              >
                <div className="relative w-16 aspect-video rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-zinc-200 transition m-0">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate m-0">{item.artist}</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold">{item.durationFormatted}</span>
              </div>
            ))}
          </div>
        </div>

        {/* More Videos from this Artist */}
        <div className="clay-card p-5 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white tracking-tight uppercase m-0 flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-white" />
              <span>More Videos from {currentTrack.artist}</span>
            </h3>
            <button
              onClick={() => navigateToArtist(currentTrack.artist)}
              className="text-xs text-white hover:underline flex items-center gap-1 font-bold"
            >
              <span>Discography</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
            {artistVideos.slice(0, 5).map((v) => (
              <div
                key={v.id}
                onClick={() => playTrack(v)}
                className="flex items-center gap-3 p-2.5 rounded-2xl clay-pill hover:border-white/30 transition cursor-pointer group"
              >
                <div className="relative w-16 aspect-video rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                  <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-zinc-200 transition m-0">
                    {v.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate m-0">{v.artist}</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold">{v.durationFormatted}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
