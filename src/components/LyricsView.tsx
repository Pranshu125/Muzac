import React, { useEffect, useRef, useState } from 'react';
import { X, Mic2, Sparkles, Music2, Disc, Sliders, Volume2, Plus, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const LyricsView: React.FC = () => {
  const {
    currentTrack,
    currentTime,
    lyrics,
    isLoadingLyrics,
    isLyricsOpen,
    setIsLyricsOpen,
    seekTo,
    vocalReductionLevel,
    setVocalReductionLevel,
    promptAddToPlaylist,
    toggleLike,
    isLiked
  } = usePlayer();

  const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);
  const [showPlain, setShowPlain] = useState<boolean>(false);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  // Determine current active lyric line
  useEffect(() => {
    if (!lyrics.syncedLyrics || lyrics.syncedLyrics.length === 0) {
      setActiveLineIndex(-1);
      return;
    }

    let foundIdx = -1;
    for (let i = 0; i < lyrics.syncedLyrics.length; i++) {
      if (currentTime >= lyrics.syncedLyrics[i].time) {
        foundIdx = i;
      } else {
        break;
      }
    }
    setActiveLineIndex(foundIdx);
  }, [currentTime, lyrics.syncedLyrics]);

  // Smooth auto-scroll to keep active line centered (Apple Music style)
  useEffect(() => {
    if (activeLineRef.current && lyricsContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeLineIndex]);

  if (!isLyricsOpen) return null;

  const liked = currentTrack ? isLiked(currentTrack.id) : false;

  return (
    <div className="fixed inset-0 top-0 bottom-0 md:top-16 md:bottom-22 z-50 md:z-25 flex select-none animate-in fade-in duration-300 backdrop-blur-3xl bg-black/95 md:bg-black/85 text-white">
      {/* Left Column: Huge Artwork & Song Info */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-1/3 max-w-md border-r border-white/10 clay-panel-deep">
        <div>
          <div className="relative group">
            <img
              src={currentTrack?.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'}
              alt={currentTrack?.title}
              className="w-full aspect-square rounded-3xl object-cover shadow-2xl border border-white/20 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-black text-white tracking-tight leading-snug m-0">
              {currentTrack?.title}
            </h2>
            <p className="text-base text-zinc-300 font-bold mt-1 m-0">
              {currentTrack?.artist}
            </p>
            {currentTrack?.album && (
              <p className="text-xs text-zinc-500 mt-1 m-0">
                {currentTrack.album}
              </p>
            )}

            {currentTrack && (
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => toggleLike(currentTrack)}
                  className="p-2.5 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
                  title="Like"
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-white text-white' : ''}`} />
                </button>
                <button
                  onClick={() => promptAddToPlaylist(currentTrack)}
                  className="p-2.5 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
                  title="Add to Playlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Badges & Mode Switcher */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-black tracking-wider rounded-lg clay-btn-white uppercase">
              Apple Music Sing
            </span>
            {lyrics.source === 'lrclib' && (
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-lg clay-pill text-zinc-300 border border-white/20 uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" />
                Time-Synced
              </span>
            )}
          </div>

          {lyrics.plainLyrics && lyrics.syncedLyrics.length > 0 && (
            <button
              onClick={() => setShowPlain(prev => !prev)}
              className="text-xs text-zinc-400 hover:text-white underline transition"
            >
              {showPlain ? 'Switch to Karaoke Mode' : 'View Full Plain Text'}
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Apple Music Karaoke Synced Lyrics */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Top Floating Bar with Apple Music Sing Vocal Slider */}
        <div className="p-5 flex items-center justify-between border-b border-white/10 clay-panel">
          <div className="flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-white" />
            <h3 className="text-xs font-black text-white tracking-widest uppercase m-0">
              Live Lyrics
            </h3>
          </div>

          {/* Apple Music Sing (Vocal Slider) */}
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl clay-card border border-white/15">
            <Mic2 className="w-4 h-4 text-white animate-pulse" />
            <div>
              <span className="text-[11px] font-extrabold text-white block">
                Apple Music Sing
              </span>
              <span className="text-[9px] text-zinc-400">
                {vocalReductionLevel > 0 ? `Vocal Cut: ${vocalReductionLevel}%` : 'Lead Vocal: Full'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={vocalReductionLevel}
              onChange={e => setVocalReductionLevel(parseInt(e.target.value, 10))}
              className="w-24 accent-white cursor-pointer ml-1"
              title="Adjust lead vocal volume for singing along"
            />
          </div>

          <button
            onClick={() => setIsLyricsOpen(false)}
            className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
            title="Close Lyrics (L)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lyrics Content */}
        <div 
          ref={lyricsContainerRef}
          className="flex-1 overflow-y-auto px-8 lg:px-16 py-20 space-y-8 custom-scrollbar"
        >
          {isLoadingLyrics ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <p className="text-sm font-bold">Fetching synced karaoke lyrics...</p>
            </div>
          ) : showPlain ? (
            <div className="max-w-xl mx-auto whitespace-pre-line text-lg leading-relaxed text-zinc-200 font-medium">
              {lyrics.plainLyrics}
            </div>
          ) : lyrics.syncedLyrics && lyrics.syncedLyrics.length > 0 ? (
            <div className="max-w-2xl mx-auto space-y-7 pb-28">
              {lyrics.syncedLyrics.map((line, idx) => {
                const isActive = idx === activeLineIndex;
                const isPast = idx < activeLineIndex;

                return (
                  <p
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => seekTo(line.time)}
                    className={`lyric-line text-2xl lg:text-4xl font-extrabold tracking-tight transition-all duration-300 m-0 ${
                      isActive
                        ? 'active text-white scale-105'
                        : isPast
                        ? 'inactive text-zinc-600'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-3">
              <Disc className="w-12 h-12 text-zinc-600 animate-spin" style={{ animationDuration: '6s' }} />
              <p className="text-base font-bold text-zinc-200">
                {lyrics.plainLyrics || 'No lyrics available for this song.'}
              </p>
              <p className="text-xs text-zinc-500">
                Enjoy the bit-perfect Hi-Res audio stream!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
