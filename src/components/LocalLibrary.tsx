import React, { useState } from 'react';
import { 
  FolderHeart, 
  Upload, 
  Music, 
  Play, 
  Trash2, 
  FileAudio, 
  HardDrive,
  Sparkles,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types';

export const LocalLibrary: React.FC = () => {
  const { playTrack, currentTrack, promptAddToPlaylist } = usePlayer();
  const [localTracks, setLocalTracks] = useState<Track[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newTracks: Track[] = [];

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('audio/') || /\.(mp3|flac|wav|m4a|ogg|aac)$/i.test(file.name)) {
        const audioUrl = URL.createObjectURL(file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        
        newTracks.push({
          id: `local-${Date.now()}-${index}`,
          title: cleanName,
          artist: 'Local Audio File',
          album: 'Device Storage',
          duration: 0,
          durationFormatted: 'Local',
          thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
          audioUrl,
          isLocal: true,
          file,
          type: 'song'
        });
      }
    });

    if (newTracks.length > 0) {
      setLocalTracks(prev => [...prev, ...newTracks]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalTracks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 space-y-8 select-none">
      {/* Header Banner - Black & White Claymorphism */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 clay-panel-deep border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-inset text-white text-xs font-bold mb-4 tracking-wider uppercase">
            <HardDrive className="w-3.5 h-3.5 text-white" />
            <span>Audiophile Local File Player</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight m-0">
            Offline &amp; Local Files Library
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed m-0">
            Play music files directly from your hard drive with full 10-band equalizer, spatial soundstage mode, and real-time audio analysis.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <div className="px-5 py-3 rounded-2xl clay-inset flex items-center gap-3">
            <FileAudio className="w-5 h-5 text-white" />
            <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-widest">
              FLAC &bull; WAV &bull; MP3
            </span>
          </div>
        </div>
      </div>

      {/* Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-all ${
          isDragging
            ? 'border-white bg-white/10 scale-[1.01]'
            : 'border-white/15 hover:border-white/30 clay-inset'
        }`}
      >
        <div className="w-16 h-16 rounded-3xl clay-card flex items-center justify-center mb-4 text-white">
          <Upload className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-lg font-black text-white mb-1">
          Drag & drop audio files here
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mb-5">
          Supports Lossless FLAC, MP3, WAV, M4A, OGG, and AAC files directly
        </p>

        <label className="px-6 py-3 rounded-2xl clay-btn-white text-black text-xs font-extrabold cursor-pointer transition shadow-xl hover:scale-105 active:scale-95">
          <span>Choose Files from Computer</span>
          <input
            type="file"
            multiple
            accept="audio/*,.mp3,.flac,.wav,.m4a,.ogg"
            onChange={e => handleFiles(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {/* Local Files List */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-white tracking-tight m-0 uppercase tracking-wider text-zinc-300">
            Loaded Tracks ({localTracks.length})
          </h3>
          {localTracks.length > 0 && (
            <button
              onClick={() => playTrack(localTracks[0], localTracks)}
              className="px-5 py-2.5 rounded-2xl clay-btn-white text-black text-xs font-extrabold flex items-center gap-2 hover:scale-105 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play All</span>
            </button>
          )}
        </div>

        {localTracks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl clay-panel-deep text-zinc-500 border border-white/10">
            <FileAudio className="w-12 h-12 mx-auto mb-3 opacity-40 text-zinc-600" />
            <p className="text-sm font-bold text-zinc-300">No local tracks imported yet</p>
            <p className="text-xs text-zinc-500">Drop your music files above to instantly stream and manage them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {localTracks.map(track => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, localTracks)}
                  className={`clay-card p-3.5 rounded-2xl flex items-center justify-between cursor-pointer group hover:bg-[#161824] transition ${
                    isCurrent ? 'ring-2 ring-white/60 bg-[#161824]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                    <div className="w-10 h-10 rounded-xl clay-inset flex items-center justify-center text-white flex-shrink-0">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div className="overflow-hidden">
                      <p className={`text-xs font-bold truncate m-0 ${isCurrent ? 'text-white font-extrabold' : 'text-zinc-200 group-hover:text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-[10px] text-zinc-400 m-0 mt-0.5">
                        {track.file ? `${(track.file.size / (1024 * 1024)).toFixed(1)} MB` : 'Local File'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
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

                    <button
                      onClick={e => removeTrack(track.id, e)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
