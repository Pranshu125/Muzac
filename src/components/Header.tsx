import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Sliders, 
  Moon, 
  Maximize2, 
  Minimize2, 
  Video, 
  Music, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  Info
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { CategoryFilter } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  selectedCategoryFilter: CategoryFilter;
  onSelectCategoryFilter: (filter: CategoryFilter) => void;
  onOpenSpotifyImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  onOpenSpotifyImport
}) => {
  const {
    audioQuality,
    setAudioQuality,
    isVideoMode,
    setIsVideoMode,
    currentView,
    setCurrentView,
    isEQOpen,
    setIsEQOpen,
    isFullscreen,
    setIsFullscreen,
    sleepTimerMinutes,
    setSleepTimer,
    setIsMasterTechOpen
  } = usePlayer();

  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'music', label: 'Music' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'videos', label: 'Videos' },
    { id: 'chill', label: 'Chill' },
    { id: 'workout', label: 'Workout' },
    { id: 'focus', label: 'Focus' }
  ];

  return (
    <header className="h-16 clay-panel border-b border-white/10 px-3 md:px-6 flex items-center justify-between z-20 gap-2 md:gap-4 select-none">
      {/* Search Input & Category Filter Chips */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-3xl">
        <form onSubmit={onSearchSubmit} className="relative flex-1 md:w-80 md:flex-initial max-w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                onSearchChange('');
              }
            }}
            placeholder="Search songs, artists, podcasts, or paste links..."
            className="w-full h-10 pl-10 pr-9 rounded-2xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/30 transition-all duration-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Category Filter Chips */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryFilter === cat.id
                  ? 'clay-btn-white'
                  : 'clay-pill text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Controls Bar */}
      <div className="flex items-center gap-2">
        {/* Seamless Audio / Video Switcher */}
        <div className="flex items-center p-1 rounded-2xl clay-card border border-white/10">
          <button
            onClick={() => {
              setIsVideoMode(false);
              if (currentView === 'video' || currentView === 'videos') {
                setCurrentView('home');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              !isVideoMode && currentView !== 'video' && currentView !== 'videos'
                ? 'bg-white text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio</span>
          </button>
          <button
            onClick={() => {
              setIsVideoMode(true);
              setCurrentView('video');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              isVideoMode || currentView === 'video' || currentView === 'videos'
                ? 'bg-white text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video</span>
          </button>
        </div>

        {/* Secondary Header Tools (Hidden on narrow mobile screens to preserve search area) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Apple Master Quality HUD Button */}
          <button
            onClick={() => setIsMasterTechOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl clay-pill text-white text-xs font-extrabold hover:bg-white hover:text-black transition shadow-sm"
            title="Apple Music Master Audio HUD (Click for Tech Specs)"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{audioQuality.toUpperCase()}</span>
          </button>

          {/* 10-Band Graphic Equalizer */}
          <button
            onClick={() => setIsEQOpen(prev => !prev)}
            className={`p-2 rounded-2xl clay-pill transition ${
              isEQOpen ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="10-Band Graphic Equalizer &amp; Spatial Audio"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Sleep Timer */}
        <div className="relative">
          <button
            onClick={() => setShowSleepMenu(prev => !prev)}
            className={`p-2 rounded-2xl clay-pill transition flex items-center gap-1 text-xs ${
              sleepTimerMinutes ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Sleep Timer"
          >
            <Moon className="w-4 h-4" />
            {sleepTimerMinutes && (
              <span className="text-[10px] font-black">{sleepTimerMinutes}m</span>
            )}
          </button>

          {showSleepMenu && (
            <div className="absolute right-0 mt-2 w-40 clay-panel-deep rounded-2xl border border-white/20 p-1.5 shadow-2xl z-50">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Sleep Timer
              </p>
              {[null, 15, 30, 45, 60].map(m => (
                <button
                  key={m === null ? 'off' : m}
                  onClick={() => {
                    setSleepTimer(m);
                    setShowSleepMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    sleepTimerMinutes === m ? 'bg-white text-black' : 'text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  {m === null ? 'Off' : `${m} minutes`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fullscreen Mode */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
