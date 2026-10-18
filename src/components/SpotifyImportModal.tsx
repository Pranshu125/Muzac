import React, { useState } from 'react';
import { X, Disc3, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { ViewMode } from '../types';

interface SpotifyImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ViewMode) => void;
}

export const SpotifyImportModal: React.FC<SpotifyImportModalProps> = ({
  isOpen,
  onClose,
  onSelectView
}) => {
  const { createPlaylist } = usePlayer();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/spotify/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to import Spotify playlist');
      }

      createPlaylist(data.title, data.description);
      onClose();
      onSelectView('spotify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/75 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg clay-panel-deep rounded-3xl border border-white/15 p-6 shadow-2xl relative text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl clay-pill flex items-center justify-center text-white border border-white/20">
              <Disc3 className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white m-0">
                Import Spotify Playlist
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 m-0">
                Bridge Spotify Songs Directly into Muzac
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleImport} className="pt-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-2">
              Spotify Link or ID
            </label>
            <input
              type="text"
              autoFocus
              placeholder="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full h-11 px-4 rounded-xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/30 transition"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl clay-pill text-xs font-bold text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="px-5 py-2.5 rounded-2xl clay-btn-white font-black text-xs flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Import Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
