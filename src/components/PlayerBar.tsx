import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart, 
  Mic2, 
  ListMusic, 
  Download, 
  Video,
  RotateCcw,
  RotateCw,
  Loader2,
  CheckCircle2,
  Cast,
  Plus,
  Sparkles,
  ShieldCheck,
  Disc3,
  AlertCircle,
  Share2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types';

interface PlayerBarProps {
  onSelectArtist?: (artist: string) => void;
  onOpenShare?: (track: Track) => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ onSelectArtist, onOpenShare }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    playbackSpeed,
    isLyricsOpen,
    isQueueOpen,
    queue,
    downloadingTrackId,
    downloadToast,
    playbackStatusMessage,
    navigateToArtist,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    skipForward,
    skipBackward,
    toggleShuffle,
    toggleRepeat,
    setPlaybackSpeed,
    setIsLyricsOpen,
    setIsQueueOpen,
    toggleLike,
    isLiked,
    isVideoMode,
    setIsVideoMode,
    downloadTrack,
    isSmartShuffle,
    toggleSmartShuffle,
    setIsMasterTechOpen,
    setIsDevicePickerOpen,
    activeDevice,
    promptAddToPlaylist
  } = usePlayer();

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const [dragSeekTime, setDragSeekTime] = useState(0);
  const speedMenuRef = useRef<HTMLDivElement | null>(null);

  // Close speed menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // High-performance smooth 60fps scrubber
  const displayTime = isDraggingSeek ? dragSeekTime : currentTime;

  const handleSeekMouseDown = () => {
    setIsDraggingSeek(true);
    setDragSeekTime(currentTime);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDragSeekTime(parseFloat(e.target.value));
  };

  const handleSeekCommit = () => {
    if (isDraggingSeek) {
      setIsDraggingSeek(false);
      seekTo(dragSeekTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleVolumeWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    setVolume(Math.min(1, Math.max(0, volume + delta)));
  };

  if (!currentTrack) {
    return (
      <>
        {/* Mobile Mini Ready-to-Play Indicator */}
        <div className="md:hidden fixed bottom-16 left-2.5 right-2.5 h-12 clay-panel rounded-2xl border border-white/15 px-3.5 flex items-center justify-between z-30 select-none shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl clay-card flex items-center justify-center text-zinc-400">
              <Mic2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-300">Ready to Stream &bull; Select a Song</span>
          </div>
        </div>

        {/* Desktop Fixed Dock Player Bar */}
        <div className="hidden md:flex fixed bottom-0 left-0 right-0 h-22 clay-panel-deep border-t border-white/10 items-center justify-between px-6 z-30 select-none shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl clay-card flex items-center justify-center text-zinc-500 border border-white/10">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-white tracking-wide m-0">Ready to Play</p>
              <p className="text-[11px] text-zinc-400 m-0">Select any song, podcast episode, or video to stream in Hi-Res ALAC</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const liked = isLiked(currentTrack.id);
  const isDownloadingThis = downloadingTrackId === currentTrack.id;

  return (
    <>
      {/* Toast Notification for In-App Downloads */}
      {downloadToast && (
        <div className="fixed bottom-26 right-8 z-50 clay-card border border-white/30 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold text-white bg-black/95 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Playback Status Toast (Error Recovery & Healing) */}
      {playbackStatusMessage && (
        <div className="fixed bottom-26 left-1/2 -translate-x-1/2 z-50 clay-card border border-white/40 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-bold text-white bg-black/90 animate-in fade-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-white animate-spin" />
          <span>{playbackStatusMessage}</span>
        </div>
      )}

      {/* Mobile Floating Mini Player (< md) with Real-Time Micro Progress Bar */}
      <div 
        className="md:hidden fixed bottom-16 left-2.5 right-2.5 h-15 clay-panel rounded-2xl border border-white/20 px-3 flex items-center justify-between z-30 select-none shadow-[0_8px_30px_rgba(0,0,0,0.9)] overflow-hidden relative"
      >
        {/* Real-time 2px micro progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 pointer-events-none">
          <div 
            className="h-full bg-white transition-all duration-150" 
            style={{ width: `${duration > 0 ? (displayTime / duration) * 100 : 0}%` }}
          />
        </div>

        {/* Tap on Left Artwork/Title opens Fullscreen/Lyrics view */}
        <div 
          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
          onClick={() => setIsLyricsOpen(true)}
        >
          <img
            src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120'}
            alt={currentTrack.title}
            className={`w-10 h-10 rounded-xl object-cover border border-white/15 flex-shrink-0 ${isPlaying ? 'animate-[spin_16s_linear_infinite]' : ''}`}
          />
          <div className="min-w-0 flex-1 pr-1">
            <p className="text-xs font-black text-white truncate m-0">{currentTrack.title}</p>
            <p className="text-[10px] text-zinc-400 truncate m-0">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Quick Mobile Controls: Share, Like, Play/Pause, Next */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onOpenShare?.(currentTrack)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white transition"
            title="Share Song (WhatsApp, Socials)"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleLike(currentTrack)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white transition"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white text-white' : ''}`} />
          </button>
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full clay-btn-white flex items-center justify-center text-black shadow-md active:scale-95 transition"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            )}
          </button>
          <button
            onClick={nextTrack}
            className="p-2 rounded-xl text-zinc-400 hover:text-white transition"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Fixed Dock Player Bar (>= md) */}
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 h-22 clay-panel-deep border-t border-white/10 px-6 items-center justify-between z-30 select-none shadow-[0_-10px_35px_rgba(0,0,0,0.85)]">
        {/* Left: Track Artwork & Info */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[230px]">
          <div 
            className="relative group cursor-pointer flex-shrink-0" 
            onClick={() => setIsLyricsOpen(prev => !prev)}
            title="Click to view Time-Synced Karaoke Lyrics (L)"
          >
            <img
              src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120'}
              alt={currentTrack.title}
              className="w-14 h-14 rounded-2xl object-cover shadow-2xl border border-white/15 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Mic2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="overflow-hidden flex-1">
            <h4 
              className="text-xs font-black text-white truncate hover:underline cursor-pointer m-0 tracking-tight"
              onClick={() => setIsLyricsOpen(prev => !prev)}
            >
              {currentTrack.title}
            </h4>
            <p 
              onClick={() => (onSelectArtist ? onSelectArtist(currentTrack.artist) : navigateToArtist(currentTrack.artist))}
              className="text-[11px] text-zinc-400 truncate mt-0.5 m-0 hover:text-white hover:underline cursor-pointer font-medium"
            >
              {currentTrack.artist}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <button
                onClick={() => setIsMasterTechOpen(true)}
                className="px-1.5 py-0.5 text-[9px] font-black rounded-md clay-pill text-white border border-white/20 hover:bg-white hover:text-black transition uppercase tracking-wider"
                title="Apple Music Master Audio HUD"
              >
                MASTER
              </button>
              {currentTrack.type === 'podcast' && (
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded-md clay-pill text-zinc-300 border border-white/10 uppercase">
                  PODCAST
                </span>
              )}
            </div>
          </div>

          {/* Action Icons: Like, Add to Playlist, Download */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleLike(currentTrack)}
              className="p-2 rounded-xl clay-pill text-zinc-400 hover:text-white transition"
              title={liked ? 'Remove from Liked' : 'Save to Liked'}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-white text-white' : ''}`} />
            </button>

            <button
              onClick={() => promptAddToPlaylist(currentTrack)}
              className="p-2 rounded-xl clay-pill text-zinc-400 hover:text-white transition"
              title="Add to Playlist"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={() => downloadTrack(currentTrack)}
              disabled={isDownloadingThis}
              className="p-2 rounded-xl clay-pill text-zinc-400 hover:text-white transition"
              title="Direct In-App Download (Zero Redirects)"
            >
              {isDownloadingThis ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => onOpenShare?.(currentTrack)}
              className="p-2 rounded-xl clay-pill text-zinc-400 hover:text-white transition"
              title="Share Track (WhatsApp, X, Copy Link)"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-2xl px-4">
          {/* Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Smart Shuffle */}
            <button
              onClick={toggleSmartShuffle}
              className={`p-2 rounded-xl transition ${
                isSmartShuffle ? 'clay-btn-white' : 'clay-pill text-zinc-400 hover:text-white'
              }`}
              title="Spotify Smart Shuffle & DJ Mode"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-xl transition ${
                isShuffle ? 'clay-btn-white' : 'clay-pill text-zinc-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => skipBackward(15)}
              className="p-2 clay-pill text-zinc-400 hover:text-white transition"
              title="Rewind 15 seconds"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={prevTrack}
              className="p-2 clay-pill text-zinc-300 hover:text-white transition"
              title="Previous Song (P)"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Tactile Big Play/Pause White Button */}
            <button
              onClick={togglePlay}
              className="clay-btn-white w-11 h-11 flex items-center justify-center shadow-2xl font-bold"
              title="Play / Pause (Space)"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current text-black" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5 text-black" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 clay-pill text-zinc-300 hover:text-white transition"
              title="Next Song (N)"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => skipForward(15)}
              className="p-2 clay-pill text-zinc-400 hover:text-white transition"
              title="Forward 15 seconds"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-xl transition ${
                repeatMode !== 'off' ? 'clay-btn-white' : 'clay-pill text-zinc-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Progress Bar & Timestamps with 60fps Smooth Dragging */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono text-zinc-400 w-10 text-right font-semibold">
              {formatTime(displayTime)}
            </span>

            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={displayTime}
                onMouseDown={handleSeekMouseDown}
                onTouchStart={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                className="w-full cursor-pointer accent-white"
              />
            </div>

            <span className="text-[11px] font-mono text-zinc-400 w-10 text-left font-semibold">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Output Device, Video, Speed, Lyrics, Queue, Volume */}
        <div className="flex items-center justify-end gap-2 w-1/4 min-w-[230px]">
          {/* Spotify Connect / AirPlay Device Picker */}
          <button
            onClick={() => setIsDevicePickerOpen(prev => !prev)}
            className={`p-2 rounded-2xl clay-pill transition ${
              activeDevice !== 'computer' ? 'clay-btn-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Connect to a Device (Spotify Connect & AirPlay)"
          >
            <Cast className="w-4 h-4" />
          </button>

          {/* Video Mode Toggle */}
          <button
            onClick={() => setIsVideoMode(prev => !prev)}
            className={`p-2 rounded-2xl clay-pill transition ${
              isVideoMode ? 'clay-btn-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Toggle Music Video Mode (V)"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div ref={speedMenuRef} className="relative">
            <button
              onClick={() => setShowSpeedMenu(prev => !prev)}
              className="p-2 rounded-2xl clay-pill text-xs font-mono font-bold text-zinc-300 hover:text-white transition"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full mb-2 right-0 clay-panel-deep rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 min-w-[70px] border border-white/10 z-50">
                {[0.75, 1, 1.25, 1.5, 2].map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setPlaybackSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono text-left font-bold transition ${
                      playbackSpeed === s ? 'clay-btn-white' : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lyrics Button */}
          <button
            onClick={() => setIsLyricsOpen(prev => !prev)}
            className={`p-2 rounded-2xl clay-pill transition ${
              isLyricsOpen ? 'clay-btn-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Lyrics & Apple Music Sing (L)"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          {/* Queue Button */}
          <button
            onClick={() => setIsQueueOpen(prev => !prev)}
            className={`p-2 rounded-2xl clay-pill transition relative ${
              isQueueOpen ? 'clay-btn-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Queue (Q)"
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black font-mono font-black text-[9px] flex items-center justify-center shadow">
                {Math.min(99, queue.length)}
              </span>
            )}
          </button>

          {/* Volume Slider & Wheel Handler with Percentage */}
          <div 
            className="flex items-center gap-2 pl-2"
            onWheel={handleVolumeWheel}
            title="Scroll wheel to adjust volume"
          >
            <button
              onClick={toggleMute}
              className="text-zinc-400 hover:text-white transition"
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-18 cursor-pointer accent-white"
            />
            <span className="text-[10px] font-mono text-zinc-400 font-bold w-6 text-right select-none">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
