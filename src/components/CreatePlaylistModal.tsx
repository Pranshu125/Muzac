import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ListMusic, 
  Sparkles, 
  Check, 
  Image as ImageIcon,
  FolderPlus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const COVER_PRESETS = [
  { id: 'c1', label: 'Vinyl Obsidian', url: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=400' },
  { id: 'c2', label: 'Moody Skyline', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { id: 'c3', label: 'Studio Audio', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { id: 'c4', label: 'Retro Cassette', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400' },
  { id: 'c5', label: 'Electric Beats', url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400' },
  { id: 'c6', label: 'Deep Focus', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' }
];

const GENRE_TAGS = ['Favorites', 'Chill & Lo-Fi', 'High Energy', 'Late Night R&B', 'Study & Focus', 'Electronic'];

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated?: (playlistId: string) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated
}) => {
  const { createPlaylist } = usePlayer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(COVER_PRESETS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(GENRE_TAGS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCover = customCoverUrl.trim() || selectedCover;
    const newPl = createPlaylist(
      title.trim(), 
      description.trim() || `Curated ${selectedGenre} playlist`, 
      finalCover, 
      selectedGenre
    );

    // Reset fields
    setTitle('');
    setDescription('');
    setCustomCoverUrl('');
    onClose();

    if (onPlaylistCreated) {
      onPlaylistCreated(newPl.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/80 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md clay-panel-deep rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl clay-card border border-white/20 flex items-center justify-center shadow-lg">
            <FolderPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight m-0">
              Create New Playlist
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 m-0">
              Personalize your track collection with custom covers and descriptions.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Playlist Title */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 px-1">
              Playlist Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Midnight Vibes, Workout Fire..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 px-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="A few words about this mix..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full h-10 px-4 rounded-2xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 transition"
            />
          </div>

          {/* Genre Tag Selection */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 px-1">
              Atmosphere / Genre
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENRE_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedGenre(tag)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                    selectedGenre === tag
                      ? 'bg-white text-black shadow-md'
                      : 'clay-pill text-zinc-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Artwork Selection */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 px-1">
              Select Cover Artwork
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COVER_PRESETS.map(cover => (
                <button
                  key={cover.id}
                  type="button"
                  onClick={() => {
                    setSelectedCover(cover.url);
                    setCustomCoverUrl('');
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedCover === cover.url && !customCoverUrl 
                      ? 'border-white scale-105 shadow-xl' 
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={cover.url} alt={cover.label} className="w-full h-full object-cover" />
                  {selectedCover === cover.url && !customCoverUrl && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom image URL option */}
          <div>
            <div className="relative">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="Or paste custom image URL..."
                value={customCoverUrl}
                onChange={e => setCustomCoverUrl(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 transition font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl clay-pill text-xs font-bold text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2.5 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition shadow-lg disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Create Playlist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
