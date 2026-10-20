import React, { useState } from 'react';
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
  Plus,
  Edit2,
  Check,
  Search,
  X,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { Track, Playlist } from '../types';

interface PlaylistViewProps {
  isLikedView?: boolean;
  playlistId?: string | null;
  onOpenShare?: (track: Track) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  isLikedView = false,
  playlistId,
  onOpenShare
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
    deletePlaylist,
    updatePlaylist
  } = usePlayer();

  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState('');

  let title = 'Liked Songs';
  let description = 'Your favorite collection of high-fidelity songs.';
  let tracks: Track[] = likedTracks;
  let coverImage = 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400';

  const pl = !isLikedView && playlistId ? customPlaylists.find(p => p.id === playlistId) : null;
  if (pl) {
    title = pl.title;
    description = pl.description || 'Custom playlist created on Muzac';
    tracks = pl.tracks;
    coverImage = pl.thumbnail || (tracks[0]?.thumbnail) || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400';
  }

  const [editTitle, setEditTitle] = useState(title);
  const [editDesc, setEditDesc] = useState(description);
  const [editCover, setEditCover] = useState(coverImage);

  // Sync edit state when playlist changes
  React.useEffect(() => {
    setEditTitle(title);
    setEditDesc(description);
    setEditCover(coverImage);
    setIsEditing(false);
    setFilterText('');
  }, [playlistId, title, description, coverImage]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistId && editTitle.trim()) {
      updatePlaylist(playlistId, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        thumbnail: editCover.trim() || coverImage
      });
      setIsEditing(false);
    }
  };

  const filteredTracks = filterText.trim()
    ? tracks.filter(t => 
        t.title.toLowerCase().includes(filterText.toLowerCase()) || 
        t.artist.toLowerCase().includes(filterText.toLowerCase())
      )
    : tracks;

  const totalDurationSeconds = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalDurationSeconds / 60);

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 select-none max-w-7xl mx-auto">
      {/* Header Banner - Black & White Claymorphism */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 sm:p-8 rounded-3xl clay-panel-deep border border-white/10 shadow-2xl relative">
        <div className="relative group flex-shrink-0">
          <img
            src={coverImage}
            alt={`${title} playlist artwork`}
            loading="lazy"
            decoding="async"
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover shadow-2xl border-2 border-white/20"
          />
          {isLikedView && (
            <div className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-xs flex items-center justify-center">
              <Heart className="w-16 h-16 text-white fill-white shadow-xl" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2 w-full">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 clay-inset px-3 py-1 rounded-full">
              {isLikedView ? 'Auto Library • Bit-Perfect' : 'Custom Playlist'}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-2 pt-1 max-w-md">
              <input
                type="text"
                required
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Playlist name..."
                className="w-full text-lg sm:text-2xl font-black px-3 py-1.5 rounded-xl clay-inset text-white outline-none border border-white/30"
              />
              <input
                type="text"
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                placeholder="Description..."
                className="w-full text-xs px-3 py-1.5 rounded-xl clay-inset text-white outline-none border border-white/20"
              />
              <input
                type="url"
                value={editCover}
                onChange={e => setEditCover(e.target.value)}
                placeholder="Cover image URL..."
                className="w-full text-xs px-3 py-1.5 rounded-xl clay-inset text-white outline-none border border-white/20 font-mono"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 rounded-xl clay-pill text-xs font-bold text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded-xl clay-btn-white text-black text-xs font-extrabold flex items-center gap-1 shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight m-0">
                  {title}
                </h1>
                {!isLikedView && playlistId && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-xl clay-pill text-zinc-400 hover:text-white transition"
                    title="Edit Playlist Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-400 max-w-lg m-0">
                {description}
              </p>
            </>
          )}

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-xs font-mono text-zinc-500 font-semibold">
            <span>{tracks.length} Songs</span>
            <span>•</span>
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

      {/* Filter / Search within Playlist */}
      {tracks.length > 3 && (
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="relative w-full max-w-xs">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in playlist..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              className="w-full h-9 pl-9 pr-8 rounded-xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 transition"
            />
            {filterText && (
              <button
                onClick={() => setFilterText('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Showing {filteredTracks.length} of {tracks.length}
          </span>
        </div>
      )}

      {/* Tracklist Table */}
      <div className="clay-panel-deep rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10">
        {tracks.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-zinc-500 space-y-2">
            <Music className="w-10 h-10 opacity-30 text-white" />
            <p className="text-sm font-bold text-zinc-300">No tracks in this playlist yet</p>
            <p className="text-xs text-zinc-500">Heart any song or click "+ Add to Playlist" to build your collection!</p>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center text-zinc-500">
            <p className="text-xs font-bold text-zinc-400">No tracks matched "{filterText}"</p>
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

            {filteredTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const liked = isLiked(track.id);

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, filteredTracks)}
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
                      loading="lazy"
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

                  <div className="flex items-center gap-2 sm:gap-3">
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
