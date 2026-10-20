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
  Trash2,
  MessageSquare,
  ShieldCheck,
  Database,
  User,
  LogIn
} from 'lucide-react';
import type { ViewMode } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { MuzacLogo } from './MuzacLogo';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenSpotifyImport: () => void;
  onSelectPlaylist: (playlistId: string) => void;
  selectedPlaylistId: string | null;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenBackup?: () => void;
  onOpenCreatePlaylist?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenSpotifyImport,
  onSelectPlaylist,
  selectedPlaylistId,
  onOpenContact,
  onOpenPrivacy,
  onOpenBackup,
  onOpenCreatePlaylist
}) => {
  const { customPlaylists, createPlaylist, deletePlaylist, likedTracks, downloadedTracks } = usePlayer();
  const { user, setIsAuthModalOpen, setIsProfileModalOpen } = useAuth();
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
        <div className="px-2 py-1">
          <MuzacLogo size="md" showText={true} />
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
              onClick={() => onOpenCreatePlaylist ? onOpenCreatePlaylist() : setIsCreatingPl(true)}
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

      {/* Compliance, Support & Utility Tools */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <button
          onClick={onOpenSpotifyImport}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl clay-pill text-white text-xs font-bold hover:bg-white hover:text-black transition group shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span>Import Spotify Link</span>
        </button>

        <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-zinc-400">
          <button
            onClick={onOpenBackup}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition flex flex-col items-center text-center"
            title="Backup & Restore Library"
          >
            <Database className="w-3.5 h-3.5 mb-1 text-zinc-300" />
            <span>Backup</span>
          </button>
          <button
            onClick={onOpenContact}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition flex flex-col items-center text-center"
            title="Contact & Requests"
          >
            <MessageSquare className="w-3.5 h-3.5 mb-1 text-zinc-300" />
            <span>Contact</span>
          </button>
          <button
            onClick={onOpenPrivacy}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition flex flex-col items-center text-center"
            title="Privacy Policy"
          >
            <ShieldCheck className="w-3.5 h-3.5 mb-1 text-zinc-300" />
            <span>Privacy</span>
          </button>
        </div>

        {/* User Profile Mini Bar */}
        <div className="pt-1 border-t border-white/10">
          {user ? (
            <div
              onClick={() => setIsProfileModalOpen(true)}
              className="p-2 rounded-2xl clay-card border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/30 transition group"
              title="View Account Profile &amp; Stats"
            >
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
                />
                <div className="truncate text-left">
                  <span className="text-xs font-black text-white block truncate group-hover:text-zinc-200">
                    {user.displayName}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block">
                    {user.tier}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-2 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center justify-center gap-2 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
