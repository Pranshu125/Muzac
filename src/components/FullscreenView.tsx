import React, { useEffect, useRef, useState } from 'react';
import { 
  Minimize2, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart, 
  Volume2, 
  VolumeX, 
  Mic2, 
  Sparkles, 
  Waves, 
  Plus 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const FullscreenView: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    isFullscreen,
    setIsFullscreen,
    lyrics,
    toggleLike,
    isLiked,
    promptAddToPlaylist
  } = usePlayer();

  const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const [dragSeekTime, setDragSeekTime] = useState(0);

  useEffect(() => {
    if (!lyrics.syncedLyrics || lyrics.syncedLyrics.length === 0) {
      setActiveLineIndex(-1);
      return;
    }
    let found = -1;
    for (let i = 0; i < lyrics.syncedLyrics.length; i++) {
      if (currentTime >= lyrics.syncedLyrics[i].time) {
        found = i;
      } else {
        break;
      }
    }
    setActiveLineIndex(found);
  }, [currentTime, lyrics.syncedLyrics]);

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeLineIndex]);

  if (!isFullscreen || !currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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

  const liked = isLiked(currentTrack.id);

  return (
    <div className="fixed inset-0 z-50 bg-[#06070a] flex flex-col justify-between p-4 sm:p-8 lg:p-12 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Top Bar - Black & White Claymorphism */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-300">
            Cinema Experience &bull; Lossless Master ALAC
          </span>
        </div>

        <button
          onClick={() => setIsFullscreen(false)}
          className="p-2 sm:p-3 rounded-2xl clay-pill text-zinc-400 hover:text-white transition hover:scale-105"
          title="Exit Fullscreen (F or Esc)"
        >
          <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Main Center Area: Artwork & Karaoke Lyrics */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-around gap-6 sm:gap-12 my-2 sm:my-6 z-10 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Giant Album Artwork */}
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="relative group">
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-44 h-44 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-3xl object-cover shadow-[12px_12px_36px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(255,255,255,0.05)] border-2 border-white/20 transition-transform duration-700 hover:scale-[1.02]"
            />
            <div
              className="absolute -inset-8 rounded-3xl blur-3xl opacity-30 -z-10 bg-white/10"
            />
          </div>

          <div className="mt-3 sm:mt-8">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight m-0">
              {currentTrack.title}
            </h1>
            <p className="text-xs sm:text-lg text-zinc-400 font-semibold mt-1 m-0">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Time-Synced Karaoke Lyrics */}
        <div className="flex-1 max-w-xl h-44 sm:h-96 overflow-y-auto space-y-4 sm:space-y-6 px-4 sm:px-6 custom-scrollbar text-center lg:text-left">
          {lyrics.syncedLyrics && lyrics.syncedLyrics.length > 0 ? (
            lyrics.syncedLyrics.map((line, idx) => {
              const isActive = idx === activeLineIndex;
              const isPast = idx < activeLineIndex;

              return (
                <p
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => seekTo(line.time)}
                  className={`cursor-pointer transition-all duration-300 m-0 ${
                    isActive
                      ? 'text-3xl font-black text-white scale-105 drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]'
                      : isPast
                      ? 'text-xl text-zinc-600 font-medium'
                      : 'text-xl text-zinc-400/80 font-medium hover:text-white'
                  }`}
                >
                  {line.text}
                </p>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
              <Waves className="w-12 h-12 opacity-30 text-white" />
              <p className="text-sm font-bold text-zinc-400">
                {lyrics.plainLyrics || 'Lossless Bit-Perfect Stream Active'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Dock */}
      <div className="max-w-3xl mx-auto w-full clay-panel-deep rounded-3xl p-5 border border-white/10 shadow-2xl z-10 flex flex-col gap-3.5">
        {/* Scrubber with 60fps Smooth Dragging */}
        <div className="flex items-center gap-3 px-2">
          <span className="text-xs font-mono text-zinc-400 w-10 text-right font-semibold">
            {formatTime(displayTime)}
          </span>
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
            className="flex-1 cursor-pointer accent-white"
          />
          <span className="text-xs font-mono text-zinc-400 w-10 text-left font-semibold">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLike(currentTrack)}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-white transition"
              title="Like Song"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-white text-white' : ''}`} />
            </button>
            <button
              onClick={() => promptAddToPlaylist(currentTrack)}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-white transition"
              title="Add to Playlist"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={prevTrack}
              className="p-2 text-zinc-400 hover:text-white transition hover:scale-110 active:scale-95"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full clay-btn-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current text-black" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5 text-black" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 text-zinc-400 hover:text-white transition hover:scale-110 active:scale-95"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-24 cursor-pointer accent-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
