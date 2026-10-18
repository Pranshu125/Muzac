import React, { useState } from 'react';
import { X, Plus, ListMusic, Check, Sparkles } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const AddToPlaylistModal: React.FC = () => {
  const {
    isAddToPlaylistOpen,
    setIsAddToPlaylistOpen,
    selectedTrackForPlaylist,
    customPlaylists,
    addToPlaylist,
    createPlaylist
  } = usePlayer();

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [addedPlaylistIds, setAddedPlaylistIds] = useState<string[]>([]);

  if (!isAddToPlaylistOpen || !selectedTrackForPlaylist) return null;

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist(playlistId, selectedTrackForPlaylist);
    setAddedPlaylistIds(prev => [...prev, playlistId]);
    setTimeout(() => {
      setIsAddToPlaylistOpen(false);
      setAddedPlaylistIds([]);
    }, 800);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const pl = createPlaylist(newPlaylistName.trim());
    addToPlaylist(pl.id, selectedTrackForPlaylist);
    setNewPlaylistName('');
    setIsCreatingNew(false);
    setIsAddToPlaylistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/75 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm clay-panel-deep rounded-3xl border border-white/15 p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-black tracking-tight text-white m-0">
              Add to Playlist
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 m-0 truncate max-w-[240px]">
              {selectedTrackForPlaylist.title}
            </p>
          </div>

          <button
            onClick={() => setIsAddToPlaylistOpen(false)}
            className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create new playlist trigger */}
        <div className="py-3">
          {isCreatingNew ? (
            <form onSubmit={handleCreateAndAdd} className="space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="Playlist name..."
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder-zinc-500 outline-none focus:border-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1 rounded-xl clay-pill text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-xl clay-btn-white text-xs font-bold"
                >
                  Create &amp; Add
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl clay-pill text-xs font-bold text-white hover:border-white/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Playlist</span>
            </button>
          )}
        </div>

        {/* Playlist List */}
        <div className="py-2 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {customPlaylists.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">No custom playlists yet. Create one above!</p>
          ) : (
            customPlaylists.map(pl => {
              const alreadyHas = pl.tracks.some(t => t.id === selectedTrackForPlaylist.id);
              const wasJustAdded = addedPlaylistIds.includes(pl.id);

              return (
                <div
                  key={pl.id}
                  onClick={() => !alreadyHas && handleAddToPlaylist(pl.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    wasJustAdded
                      ? 'bg-white text-black font-bold'
                      : alreadyHas
                      ? 'bg-white/5 opacity-60 cursor-not-allowed border border-white/5'
                      : 'clay-card text-zinc-200 hover:text-white hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ListMusic className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="text-xs font-bold block">{pl.title}</span>
                      <span className="text-[10px] text-zinc-500">{pl.tracks.length} songs</span>
                    </div>
                  </div>

                  <div>
                    {alreadyHas || wasJustAdded ? (
                      <span className="text-[10px] font-bold flex items-center gap-1 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </span>
                    ) : (
                      <Plus className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
