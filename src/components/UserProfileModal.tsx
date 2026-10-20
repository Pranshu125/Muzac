import React from 'react';
import { 
  X, 
  User, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  ListMusic, 
  Clock, 
  Plus, 
  Database, 
  Check,
  Disc3,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

interface UserProfileModalProps {
  onOpenCreatePlaylist?: () => void;
  onOpenBackup?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  onOpenCreatePlaylist,
  onOpenBackup
}) => {
  const { user, isProfileModalOpen, setIsProfileModalOpen, logout, setIsAuthModalOpen, isGuest } = useAuth();
  const { likedTracks, customPlaylists, history } = usePlayer();

  if (!isProfileModalOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/80 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm clay-panel-deep rounded-3xl border border-white/15 p-6 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute right-4 top-4 p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Card Header */}
        <div className="text-center pt-2 pb-4">
          <div className="relative inline-block mb-3">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-white/20 shadow-2xl mx-auto"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-wider shadow-md">
              {user.tier}
            </span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight m-0">
            {user.displayName}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 m-0 font-mono">
            @{user.username} &bull; {user.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 mb-4">
          <div className="p-3 rounded-2xl clay-inset text-center">
            <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
            <span className="text-base font-black text-white block">{likedTracks.length}</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Liked</span>
          </div>
          <div className="p-3 rounded-2xl clay-inset text-center">
            <ListMusic className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <span className="text-base font-black text-white block">{customPlaylists.length}</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Playlists</span>
          </div>
          <div className="p-3 rounded-2xl clay-inset text-center">
            <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-base font-black text-white block">{user.listeningHours}h</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Streamed</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 mb-4">
          {onOpenCreatePlaylist && (
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                onOpenCreatePlaylist();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl clay-pill text-xs font-bold text-white hover:border-white/30 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-zinc-300" />
                <span>Create New Playlist</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Custom</span>
            </button>
          )}

          {onOpenBackup && (
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                onOpenBackup();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl clay-pill text-xs font-bold text-white hover:border-white/30 transition text-left"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-zinc-300" />
                <span>Backup / Export Library</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">JSON</span>
            </button>
          )}
        </div>

        {/* Member Tier Perks */}
        <div className="p-3 rounded-2xl clay-card mb-5 border border-white/10 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-[11px] text-zinc-300">
            <span className="font-bold text-white block">Lossless Master Stream Active</span>
            <span className="text-zinc-500 text-[10px]">24-bit 192kHz studio quality &amp; spatial audio enabled</span>
          </div>
        </div>

        {/* Sign In / Sign Out CTA */}
        {isGuest ? (
          <button
            onClick={() => {
              setIsProfileModalOpen(false);
              setIsAuthModalOpen(true);
            }}
            className="w-full py-3 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Sign In / Create Account</span>
          </button>
        ) : (
          <button
            onClick={logout}
            className="w-full py-2.5 rounded-2xl clay-pill text-red-400 hover:text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out (@{user.username})</span>
          </button>
        )}
      </div>
    </div>
  );
};
