import React, { useState } from 'react';
import { 
  Disc3, 
  Sparkles, 
  Play, 
  Plus, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Loader2, 
  Music, 
  Download 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { cachedFetch } from '../utils/apiCache';
import type { Track, Playlist } from '../types';

interface SpotifyHubProps {
  onOpenPlaylist?: (playlist: Playlist) => void;
}

export const SpotifyHub: React.FC<SpotifyHubProps> = () => {
  const { playTrack, createPlaylist, downloadTrack, promptAddToPlaylist } = usePlayer();
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<any | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [curatedPlaylists, setCuratedPlaylists] = useState<any[]>([]);
  const [isLoadingCurated, setIsLoadingCurated] = useState(false);

  // Load curated playlists with instant cache
  React.useEffect(() => {
    setIsLoadingCurated(true);
    cachedFetch('/api/spotify/featured')
      .then(data => {
        if (data?.playlists) setCuratedPlaylists(data.playlists);
      })
      .catch(console.error)
      .finally(() => setIsLoadingCurated(false));
  }, []);

  const handleImport = async (urlToImport?: string) => {
    const target = (urlToImport || spotifyUrl).trim();
    if (!target) return;

    setIsLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/spotify/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to import Spotify playlist');
      }

      setImportedData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySpotifyTrack = async (spotifyTrack: any) => {
    try {
      const res = await fetch(`/api/resolve-track?title=${encodeURIComponent(spotifyTrack.title)}&artist=${encodeURIComponent(spotifyTrack.artist)}`);
      const data = await res.json();
      if (data.track) {
        playTrack(data.track);
      } else {
        alert('Could not resolve audio stream for this track.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlayAll = async () => {
    if (!importedData || !importedData.tracks || importedData.tracks.length === 0) return;
    const first = importedData.tracks[0];
    await handlePlaySpotifyTrack(first);
  };

  const handleSaveToLibrary = () => {
    if (!importedData) return;
    createPlaylist(importedData.title, importedData.description);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 select-none">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 clay-panel-deep border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-inset text-white text-xs font-bold mb-4 tracking-wider uppercase">
            <Disc3 className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '4s' }} />
            <span>Spotify Connect & Metadata Bridge</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight m-0">
            Spotify Music Explorer &amp; Importer
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed m-0">
            Paste any Spotify Playlist, Album, or Track URL below. Muzac automatically bridges Spotify metadata with lossless bit-perfect streams without advertisements or paid Spotify accounts.
          </p>

          {/* Import Input Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
                value={spotifyUrl}
                onChange={e => setSpotifyUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleImport()}
                className="w-full h-12 px-4 rounded-2xl clay-inset text-sm text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-white/40 transition font-mono"
              />
            </div>
            <button
              onClick={() => handleImport()}
              disabled={isLoading || !spotifyUrl.trim()}
              className="h-12 px-7 rounded-2xl clay-btn-white disabled:opacity-50 text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Import Playlist</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="relative z-10 flex-shrink-0">
          <div className="px-5 py-3 rounded-2xl clay-inset flex items-center gap-3">
            <Music className="w-5 h-5 text-white" />
            <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-widest">
              Lossless ALAC Match
            </span>
          </div>
        </div>
      </div>

      {/* Imported Result Showcase */}
      {importedData && (
        <div className="clay-panel-deep rounded-3xl p-6 lg:p-8 border border-white/10 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={importedData.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200'}
              alt={importedData.title}
              className="w-40 h-40 rounded-2xl object-cover shadow-2xl border border-white/20"
            />
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 clay-inset px-2.5 py-1 rounded-md">
                Imported {importedData.type}
              </span>
              <h3 className="text-2xl font-black text-white mt-3 m-0">
                {importedData.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 m-0 max-w-xl">
                {importedData.description}
              </p>
              <p className="text-xs font-mono text-zinc-500 mt-2 m-0">
                {importedData.trackCount} tracks imported &bull; Bit-perfect bridge ready
              </p>

              {/* Action buttons */}
              <div className="mt-5 flex items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={handlePlayAll}
                  className="px-6 py-2.5 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play First Song</span>
                </button>

                <button
                  onClick={handleSaveToLibrary}
                  className="px-5 py-2.5 rounded-2xl clay-pill text-white text-xs font-bold flex items-center gap-2 hover:scale-105 transition"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Saved to Library!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Save as Custom Playlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tracklist Preview */}
          <div className="space-y-1 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 px-2">
              Imported Tracklist ({importedData.tracks.length})
            </h4>
            <div className="max-h-96 overflow-y-auto space-y-1.5 custom-scrollbar">
              {importedData.tracks.map((track: any, idx: number) => (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => handlePlaySpotifyTrack(track)}
                  className="clay-card group flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-[#161824] transition"
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <span className="text-xs font-mono text-zinc-500 w-6 text-center">
                      {idx + 1}
                    </span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate m-0 group-hover:text-zinc-200 transition">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate m-0">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const res = await fetch(`/api/resolve-track?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`);
                          const data = await res.json();
                          if (data.track) {
                            promptAddToPlaylist(data.track);
                          }
                        } catch {}
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition"
                      title="Add to Playlist"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const res = await fetch(`/api/resolve-track?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`);
                          const data = await res.json();
                          if (data.track) {
                            downloadTrack(data.track);
                          }
                        } catch {}
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition"
                      title="Download Song (Bit-Perfect)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-xs font-mono text-zinc-500">
                      {Math.floor(track.duration / 60)}:{track.duration % 60 < 10 ? '0' : ''}{track.duration % 60}
                    </span>

                    <div className="w-7 h-7 rounded-full clay-btn-white text-black flex items-center justify-center shadow">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Curated Spotify Playlists Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight m-0">
              Popular Global Spotify Charts & Playlists
            </h3>
            <p className="text-xs text-zinc-400 mt-1 m-0">
              Select any playlist to inspect, stream in Lossless, or clone to your local library
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {curatedPlaylists.map(pl => (
            <div
              key={pl.id}
              onClick={() => handleImport(pl.id)}
              className="clay-card rounded-3xl p-4 cursor-pointer group flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3 shadow-lg">
                <img
                  src={pl.thumbnail}
                  alt={pl.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-12 h-12 rounded-full clay-btn-white text-black flex items-center justify-center shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                </div>
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full clay-inset text-[9px] font-extrabold uppercase tracking-widest text-white">
                  {pl.genre}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-black text-white truncate m-0 group-hover:text-zinc-200 transition">
                  {pl.title}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 m-0 leading-snug">
                  {pl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
