import React from 'react';
import { 
  Play, 
  Shuffle, 
  Heart, 
  Trash2, 
  Music, 
  Clock, 
  Sparkles,
  ListMusic,
  Download,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { Track, Playlist } from '../types';

interface PlaylistViewProps {
  isLikedView?: boolean;
  playlistId?: string | null;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  isLikedView = false,
  playlistId
}) => {
  const { 
    likedTracks, 
    customPlaylists, 
    playTrack, 
    currentTrack, 
    toggleLike, 
    isLiked,
    downloadTrack,
    navigateToArtist,
    promptAddToPlaylist,
    removeFromPlaylist,
    deletePlaylist
  } = usePlayer();

  let title = 'Liked Songs';
  let description = 'Your favorite collection of high-fidelity songs.';
  let tracks: Track[] = likedTracks;
  let coverImage = 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400';

  if (!isLikedView && playlistId) {
    const pl = customPlaylists.find(p => p.id === playlistId);
    if (pl) {
      title = pl.title;
      description = pl.description || 'Custom playlist created on Muzac';
      tracks = pl.tracks;
      coverImage = pl.thumbnail || (tracks[0]?.thumbnail) || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400';
    }
  }

  const totalDurationSeconds = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalDurationSeconds / 60);

  return (
    <div className="p-8 space-y-8 select-none">
      {/* Header Banner - Black & White Claymorphism */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-8 rounded-3xl clay-panel-deep border border-white/10 shadow-2xl">
        <div className="relative group flex-shrink-0">
          <img
            src={coverImage}
            alt={title}
            className="w-48 h-48 rounded-3xl object-cover shadow-2xl border-2 border-white/20"
          />
          {isLikedView && (
            <div className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-xs flex items-center justify-center">
              <Heart className="w-16 h-16 text-white fill-white shadow-xl" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 clay-inset px-3 py-1 rounded-full">
              {isLikedView ? 'Auto Library &bull; Bit-Perfect' : 'Custom Playlist'}
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight m-0">
            {title}
          </h1>
          <p className="text-xs text-zinc-400 max-w-lg m-0">
            {description}
          </p>

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-xs font-mono text-zinc-500 font-semibold">
            <span>{tracks.length} Songs</span>
            <span>&bull;</span>
            <span>{totalMinutes} Minutes</span>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {tracks.length > 0 && (
              <>
                <button
                  onClick={() => playTrack(tracks[0], tracks)}
                  className="px-6 py-2.5 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play All</span>
                </button>

                <button
                  onClick={() => {
                    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
                    playTrack(shuffled[0], shuffled);
                  }}
                  className="px-5 py-2.5 rounded-2xl clay-pill text-white text-xs font-bold flex items-center gap-2 hover:scale-105 transition"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Shuffle</span>
                </button>
              </>
            )}

            {!isLikedView && playlistId && (
              <button
                onClick={() => {
                  if (confirm(`Delete playlist "${title}"?`)) {
                    deletePlaylist(playlistId);
                  }
                }}
                className="px-4 py-2.5 rounded-2xl clay-pill text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Delete Playlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="clay-panel-deep rounded-3xl p-6 lg:p-8 border border-white/10">
        {tracks.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-zinc-500 space-y-2">
            <Music className="w-10 h-10 opacity-30 text-white" />
            <p className="text-sm font-bold text-zinc-300">No tracks in this playlist yet</p>
            <p className="text-xs text-zinc-500">Heart any song or click "+ Add to Playlist" to build your collection!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500 px-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-4">
                <span className="w-6 text-center">#</span>
                <span>Title</span>
              </div>
              <div className="flex items-center gap-6">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>

            {tracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const liked = isLiked(track.id);

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, tracks)}
                  className={`clay-card group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer hover:bg-[#161824] transition ${
                    isCurrent ? 'ring-2 ring-white/60 bg-[#161824]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                    <span className="text-xs font-mono text-zinc-500 w-6 text-center group-hover:hidden font-bold">
                      {idx + 1}
                    </span>
                    <div className="w-6 text-center hidden group-hover:block text-white">
                      <Play className="w-3.5 h-3.5 fill-current mx-auto" />
                    </div>

                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-11 h-11 rounded-xl object-cover shadow-md flex-shrink-0"
                    />

                    <div className="overflow-hidden flex-1 pr-4">
                      <p className={`text-xs font-bold truncate m-0 ${isCurrent ? 'text-white font-extrabold' : 'text-zinc-200 group-hover:text-white'}`}>
                        {track.title}
                      </p>
                      <p 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToArtist(track.artist);
                        }}
                        className="text-[11px] text-zinc-400 truncate m-0 hover:text-white hover:underline cursor-pointer mt-0.5"
                      >
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
                      title="Add to Another Playlist"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        downloadTrack(track);
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition"
                      title="Download Song Directly (Bit-Perfect ALAC)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleLike(track);
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition"
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-white text-white' : ''}`} />
                    </button>

                    {!isLikedView && playlistId && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          removeFromPlaylist(playlistId, track.id);
                        }}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 transition"
                        title="Remove from Playlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <span className="text-xs font-mono text-zinc-500 w-10 text-right">
                      {track.durationFormatted || ''}
                    </span>
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
