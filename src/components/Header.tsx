import React, { useState, useRef, useEffect } from 'react';
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
  Info,
  TrendingUp,
  Clock,
  MessageSquare,
  User,
  LogIn
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import type { CategoryFilter } from '../types';

const TRENDING_SEARCHES = [
  'The Weeknd',
  'Taylor Swift',
  'Daft Punk',
  'Billie Eilish',
  'Lofi Chill Beats',
  'Kendrick Lamar',
  'Drake',
  'Billboard Hot 100'
];

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  selectedCategoryFilter: CategoryFilter;
  onSelectCategoryFilter: (filter: CategoryFilter) => void;
  onOpenSpotifyImport: () => void;
  onOpenContact?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  onOpenSpotifyImport,
  onOpenContact
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

  const { user, setIsAuthModalOpen, setIsProfileModalOpen, isAuthenticated } = useAuth();

  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const sleepMenuRef = useRef<HTMLDivElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sleepMenuRef.current && !sleepMenuRef.current.contains(e.target as Node)) {
        setShowSleepMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="h-16 clay-panel border-b border-white/10 px-3 md:px-6 flex items-center justify-between z-20 gap-2 md:gap-4 select-none relative">
      {/* Search Input & Category Filter Chips */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-3xl">
        <div ref={searchContainerRef} className="relative flex-1 md:w-80 md:flex-initial max-w-full">
          <form onSubmit={e => {
            setIsSearchFocused(false);
            onSearchSubmit(e);
          }}>
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  onSearchChange('');
                  setIsSearchFocused(false);
                }
              }}
              placeholder="Search songs, artists, podcasts, or paste links..."
              className="w-full h-10 pl-10 pr-9 rounded-2xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all duration-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Quick Trending Searches Dropdown */}
          {isSearchFocused && !searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 clay-panel-deep rounded-2xl border border-white/15 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2 px-1 mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Trending Searches
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_SEARCHES.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onSearchChange(item);
                      setIsSearchFocused(false);
                    }}
                    className="px-3 py-1 rounded-xl clay-pill text-xs font-bold text-zinc-300 hover:text-white hover:border-white/30 transition text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
        {/* Live Lossless Audio Connection Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full clay-pill text-[10px] font-black uppercase text-zinc-300 border border-white/10 tracking-widest" title="Backend Stream Engine: 24-bit / 192 kHz ALAC Lossless Active">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span>Lossless Synced</span>
        </div>

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
        <div ref={sleepMenuRef} className="relative">
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

        {/* Contact & Feedback */}
        {onOpenContact && (
          <button
            onClick={onOpenContact}
            className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
            title="Contact, Requests & Feedback"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}

        {/* Fullscreen Mode */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* User Account / Profile Button */}
        {user ? (
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 p-1 pr-2.5 rounded-full clay-pill text-xs font-bold text-white hover:border-white/30 transition shadow-sm"
            title={`Account: ${user.displayName} (@${user.username})`}
          >
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-7 h-7 rounded-full object-cover border border-white/30"
            />
            <span className="hidden sm:inline max-w-[90px] truncate text-[11px] font-extrabold">
              {user.displayName}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1.5 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center gap-1.5 transition hover:scale-105 active:scale-95 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
