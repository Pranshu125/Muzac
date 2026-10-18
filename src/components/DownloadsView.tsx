import React from 'react';
import { 
  Download, 
  Play, 
  Trash2, 
  CheckCircle2, 
  Music, 
  HardDrive, 
  Sparkles,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types';

export const DownloadsView: React.FC = () => {
  const { downloadedTracks, playTrack, currentTrack, promptAddToPlaylist } = usePlayer();

  return (
    <div className="p-8 space-y-8 select-none">
      {/* Header Banner - Black & White Claymorphism */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 clay-panel-deep border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-inset text-white text-xs font-bold mb-4 tracking-wider uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Lossless Device Storage</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight m-0">
            Downloaded Music & Episodes
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed m-0">
            Every song and podcast you download directly in Muzac is saved locally on your device for high-fidelity offline listening with zero external redirects.
          </p>

          <div className="mt-5 flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-white" />
              Bit-Perfect ALAC Audio
            </span>
            <span>&bull;</span>
            <span>{downloadedTracks.length} files saved locally</span>
          </div>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <div className="px-5 py-3 rounded-2xl clay-inset flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-white" />
            <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-widest">
              Direct In-App Storage
            </span>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div className="clay-panel-deep rounded-3xl p-6 lg:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-white tracking-tight m-0 uppercase tracking-wider text-zinc-300">
            Saved Offline ({downloadedTracks.length})
          </h2>

          {downloadedTracks.length > 0 && (
            <button
              onClick={() => playTrack(downloadedTracks[0], downloadedTracks)}
              className="px-6 py-2.5 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play All Offline</span>
            </button>
          )}
        </div>

        {downloadedTracks.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-3">
            <Download className="w-12 h-12 mx-auto text-zinc-600 opacity-40" />
            <h3 className="text-base font-bold text-zinc-300">No downloads saved yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Click the Download icon next to any song, album, or podcast episode to save it offline directly to your computer!
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {downloadedTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, downloadedTracks)}
                  className={`clay-card group flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#161824] transition cursor-pointer ${
                    isCurrent ? 'ring-2 ring-white/60 bg-[#161824]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                    <span className="text-xs font-mono text-zinc-500 w-5 text-center font-bold">
                      {idx + 1}
                    </span>

                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0"
                    />

                    <div className="overflow-hidden flex-1">
                      <p className={`text-xs font-bold truncate m-0 ${isCurrent ? 'text-white font-extrabold' : 'text-zinc-200 group-hover:text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5 m-0">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        promptAddToPlaylist(track);
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition"
                      title="Add to Playlist"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <span className="px-2.5 py-1 rounded-md clay-inset text-white text-[10px] font-mono font-bold tracking-wider">
                      OFFLINE
                    </span>
                    <span className="text-xs font-mono text-zinc-500 w-12 text-right">
                      {track.durationFormatted || ''}
                    </span>
                    <div className="w-8 h-8 rounded-full clay-btn-white text-black flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
