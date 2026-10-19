import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Shuffle, 
  Play, 
  Music, 
  Radio, 
  Sparkles, 
  Compass, 
  Zap, 
  Coffee, 
  Disc3,
  Loader2,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { RadioTunerMode } from '../types';

const TUNER_MODES: { id: RadioTunerMode; label: string; icon: React.FC<any> }[] = [
  { id: 'familiar', label: 'Familiar', icon: Sparkles },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'deep-cuts', label: 'Deep Cuts', icon: Disc3 },
  { id: 'uptempo', label: 'Uptempo', icon: Zap },
  { id: 'chill', label: 'Chill', icon: Coffee }
];

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentTrack,
    isQueueOpen,
    setIsQueueOpen,
    playTrack,
    removeFromQueue,
    clearQueue,
    toggleShuffle,
    isShuffle,
    activeRadioMode,
    applyRadioMode,
    navigateToArtist,
    promptAddToPlaylist
  } = usePlayer();

  const [isTuning, setIsTuning] = useState(false);

  if (!isQueueOpen) return null;

  const handleTune = async (mode: RadioTunerMode) => {
    setIsTuning(true);
    try {
      await applyRadioMode(mode);
    } finally {
      setIsTuning(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        onClick={() => setIsQueueOpen(false)} 
        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-in fade-in duration-200"
      />

      <div className="fixed top-0 md:top-16 bottom-0 md:bottom-22 right-0 w-full sm:w-88 lg:w-96 clay-panel-deep border-l border-white/15 z-50 flex flex-col p-5 shadow-2xl select-none animate-in slide-in-from-right duration-250 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-black tracking-tight text-white m-0">
            Playing Queue
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 m-0">
            {queue.length} {queue.length === 1 ? 'song' : 'songs'} in line
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-xl transition ${
              isShuffle ? 'clay-btn-white font-bold' : 'clay-pill text-zinc-400 hover:text-white'
            }`}
            title="Shuffle Queue"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={clearQueue}
            className="p-2 rounded-xl clay-pill text-zinc-400 hover:text-red-400 transition"
            title="Clear Queue"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-2 rounded-xl clay-pill text-zinc-400 hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="py-4 border-b border-white/10">
          <p className="text-[10px] uppercase font-black tracking-wider text-zinc-400 mb-2">
            Now Playing
          </p>
          <div className="flex items-center gap-3 p-3 rounded-2xl clay-card border border-white/20">
            <img
              src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80'}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-xl object-cover shadow"
            />
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate m-0">
                {currentTrack.title}
              </p>
              <p 
                onClick={() => navigateToArtist(currentTrack.artist)}
                className="text-[11px] text-zinc-400 truncate mt-0.5 m-0 hover:text-white hover:underline cursor-pointer"
              >
                {currentTrack.artist}
              </p>
            </div>
            <div className="flex items-center gap-1 px-1">
              <span className="w-1 h-3 rounded-full bg-white animate-pulse" />
              <span className="w-1 h-5 rounded-full bg-zinc-300 animate-pulse delay-75" />
              <span className="w-1 h-2 rounded-full bg-white animate-pulse delay-150" />
            </div>
          </div>
        </div>
      )}

      {/* YouTube Music Signature: Radio Tuner Modes */}
      <div className="py-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-white" />
            YTM Radio Tuner
          </span>
          {isTuning && (
            <span className="text-[10px] text-white flex items-center gap-1 animate-pulse font-bold">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              Tuning...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {TUNER_MODES.map(mode => {
            const Icon = mode.icon;
            const isActive = activeRadioMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => handleTune(mode.id)}
                disabled={isTuning}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide transition-all ${
                  isActive
                    ? 'clay-btn-white'
                    : 'clay-pill text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-2.5 h-2.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Up Next List */}
      <div className="flex-1 overflow-y-auto pt-3 space-y-1.5 custom-scrollbar">
        <p className="text-[10px] uppercase font-black tracking-wider text-zinc-500 mb-2 px-1">
          Up Next
        </p>

        {queue.slice(queueIndex + 1).length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-zinc-500 space-y-2">
            <Radio className="w-8 h-8 opacity-40 text-white" />
            <p className="text-xs font-bold text-zinc-400">No more songs queued.</p>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Smart Radio will autoplay next!</span>
            </div>
          </div>
        ) : (
          queue.slice(queueIndex + 1).map((track, i) => {
            const actualIndex = queueIndex + 1 + i;
            return (
              <div
                key={`${track.id}-${actualIndex}`}
                className="group flex items-center justify-between p-2 rounded-2xl clay-card hover:border-white/20 transition cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                  <span className="text-[11px] font-mono text-zinc-500 w-4 text-center">
                    {i + 1}
                  </span>
                  <img
                    src={track.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=60'}
                    alt={track.title}
                    className="w-10 h-10 rounded-xl object-cover shadow flex-shrink-0"
                  />
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-white truncate m-0 group-hover:text-zinc-200 transition">
                      {track.title}
                    </p>
                    <p 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToArtist(track.artist);
                      }}
                      className="text-[10px] text-zinc-400 truncate m-0 hover:text-white hover:underline"
                    >
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      promptAddToPlaylist(track);
                    }}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white transition"
                    title="Add to Playlist"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(actualIndex);
                    }}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-400 transition"
                    title="Remove from Queue"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  </>
);
};
