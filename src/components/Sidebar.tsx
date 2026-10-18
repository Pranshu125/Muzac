import React, { useState } from 'react';
import { 
  Home, 
  Compass, 
  Radio, 
  Video, 
  Download, 
  FolderHeart, 
  Heart, 
  ListMusic, 
  Plus, 
  Sparkles,
  Disc3,
  AudioWaveform,
  Library,
  Globe2,
  Trophy,
  Trash2
} from 'lucide-react';
import type { ViewMode } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenSpotifyImport: () => void;
  onSelectPlaylist: (playlistId: string) => void;
  selectedPlaylistId: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenSpotifyImport,
  onSelectPlaylist,
  selectedPlaylistId
}) => {
  const { customPlaylists, createPlaylist, deletePlaylist, likedTracks, downloadedTracks } = usePlayer();
  const [isCreatingPl, setIsCreatingPl] = useState(false);
  const [newPlTitle, setNewPlTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlTitle.trim()) return;
    const pl = createPlaylist(newPlTitle.trim());
    setNewPlTitle('');
    setIsCreatingPl(false);
    onSelectPlaylist(pl.id);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore & Charts', icon: Compass },
    { id: 'city-charts', label: 'City Top 100', icon: Globe2, badge: 'Apple' },
    { id: 'podcasts', label: 'Podcasts', icon: Radio, badge: 'New' },
    { id: 'video', label: 'Music Videos', icon: Video },
    { id: 'spotify', label: 'Spotify Charts', icon: Disc3 },
    { id: 'replay', label: 'Replay / Recap', icon: Trophy, badge: 'Stats' }
  ];

  const libraryItems = [
    { id: 'liked', label: 'Liked Songs', icon: Heart, count: likedTracks.length },
    { id: 'downloads', label: 'Downloads', icon: Download, count: downloadedTracks.length },
    { id: 'local', label: 'Local Files', icon: FolderHeart, count: null }
  ];

  return (
    <aside className="hidden md:flex w-64 h-[calc(100vh-5.5rem)] clay-panel border-r border-white/10 flex-col justify-between p-4 select-none z-10 transition-all duration-300">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="relative w-10 h-10 rounded-2xl clay-card border border-white/20 flex items-center justify-center shadow-xl">
            <AudioWaveform className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white block">
              Muzac
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400">
                Hi-Res Master
              </span>
            </div>
          </div>
        </div>

        {/* Primary Discovery Navigation */}
        <div className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id as ViewMode)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold tracking-wide transition-all ${
                  isActive
                    ? 'clay-btn-white'
                    : 'clay-pill text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    isActive ? 'bg-black text-white' : 'bg-white/10 text-white border border-white/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Library Section */}
        <div className="pt-2">
          <div className="px-3 flex items-center gap-2 mb-2">
            <Library className="w-3.5 h-3.5 text-zinc-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 m-0">
              Your Library
            </p>
          </div>

          <div className="space-y-1">
            {libraryItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id as ViewMode)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'clay-btn-white'
                      : 'clay-pill text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-black' : 'text-zinc-500'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Playlists */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Playlists
            </span>
            <button
              onClick={() => setIsCreatingPl(true)}
              className="p-1.5 rounded-xl clay-pill text-zinc-400 hover:text-white transition"
              title="Create Playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isCreatingPl && (
            <form onSubmit={handleCreate} className="px-2 mb-2">
              <input
                type="text"
                autoFocus
                placeholder="Playlist name..."
                value={newPlTitle}
                onChange={e => setNewPlTitle(e.target.value)}
                onBlur={() => !newPlTitle && setIsCreatingPl(false)}
                className="w-full text-xs px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-zinc-500 outline-none focus:border-white"
              />
            </form>
          )}

          <div className="max-h-36 overflow-y-auto space-y-1 custom-scrollbar px-1">
            {customPlaylists.map(pl => (
              <div
                key={pl.id}
                onClick={() => {
                  onSelectPlaylist(pl.id);
                  onSelectView('playlist');
                }}
                className={`group w-full text-left px-3 py-2 rounded-xl text-xs truncate transition flex items-center justify-between cursor-pointer ${
                  currentView === 'playlist' && selectedPlaylistId === pl.id
                    ? 'clay-btn-white font-bold'
                    : 'clay-pill text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <ListMusic className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{pl.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500">{pl.tracks.length}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(pl.id);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                    title="Delete Playlist"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spotify Import Quick Link */}
      <div className="pt-3 border-t border-white/10">
        <button
          onClick={onOpenSpotifyImport}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl clay-pill text-white text-xs font-bold hover:bg-white hover:text-black transition group shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span>Import Spotify Link</span>
        </button>
      </div>
    </aside>
  );
};
