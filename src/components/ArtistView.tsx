import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Heart, 
  Download, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  Disc, 
  Video, 
  Users,
  Loader2,
  ChevronRight,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { ArtistProfile, Track } from '../types';

interface ArtistViewProps {
  artistName: string;
  onSelectArtist: (name: string) => void;
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artistName, onSelectArtist }) => {
  const { playTrack, currentTrack, downloadTrack, toggleLike, isLiked, promptAddToPlaylist } = usePlayer();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/artist/${encodeURIComponent(artistName)}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [artistName]);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-zinc-400 space-y-3">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-sm font-mono">Loading {artistName}'s discography & master audio...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center text-zinc-500">
        <p>Artist details unavailable.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 select-none">
      {/* Cinematic Artist Banner - Black & White Claymorphism */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-12 clay-panel-deep border border-white/10 shadow-2xl flex flex-col md:flex-row items-center md:items-end justify-between gap-8 min-h-[320px]">
        {/* Background Image with Ambient Dark Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 grayscale blur-sm scale-105"
          style={{ backgroundImage: `url(${profile.banner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090e] via-[#08090e]/80 to-transparent" />

        <div className="relative z-10 space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full clay-inset text-white text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              Verified Master Artist
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {profile.monthlyListeners} Monthly Listeners
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none m-0 drop-shadow-2xl">
            {profile.name}
          </h1>

          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed m-0">
            {profile.bio}
          </p>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
            {profile.topTracks.length > 0 && (
              <button
                onClick={() => playTrack(profile.topTracks[0], profile.topTracks)}
                className="px-6 py-3 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Popular</span>
              </button>
            )}

            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition ${
                isFollowing
                  ? 'clay-btn-white text-black'
                  : 'clay-pill text-white hover:border-white/40'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative z-10 flex-shrink-0">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover shadow-2xl border-4 border-white/20"
          />
        </div>
      </div>

      {/* Top Songs Table */}
      <div className="clay-panel-deep rounded-3xl p-6 lg:p-8 border border-white/10 space-y-4">
        <h2 className="text-lg font-black text-white tracking-tight m-0 px-2 uppercase tracking-wider text-zinc-300">
          Popular Master Releases
        </h2>

        <div className="space-y-1.5">
          {profile.topTracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const liked = isLiked(track.id);

            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => playTrack(track, profile.topTracks)}
                className={`clay-card group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer hover:bg-[#161824] transition ${
                  isCurrent ? 'ring-2 ring-white/60 bg-[#161824]' : ''
                }`}
              >
                <div className="flex items-center gap-4 overflow-hidden flex-1">
                  <span className="text-xs font-mono text-zinc-500 w-5 text-center group-hover:hidden font-bold">
                    {idx + 1}
                  </span>
                  <div className="w-5 text-center hidden group-hover:block text-white">
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

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      downloadTrack(track);
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition"
                    title="Download Song Directly (Lossless ALAC)"
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

                  <span className="text-xs font-mono text-zinc-500 w-10 text-right">
                    {track.durationFormatted || ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discography Section */}
      <div>
        <h2 className="text-lg font-black text-white tracking-tight mb-4 px-1 m-0 uppercase tracking-wider text-zinc-300">
          Discography & Master Albums
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {profile.albums.map((album, i) => (
            <div
              key={i}
              className="clay-card rounded-3xl p-4 cursor-pointer group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3 shadow-lg">
                <img
                  src={album.thumbnail || profile.avatar}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div>
                <h4 className="text-xs font-black text-white truncate m-0 group-hover:text-zinc-200 transition">
                  {album.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5 m-0">
                  {album.year} &bull; {album.trackCount} Tracks
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Music Videos */}
      {profile.musicVideos.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-white tracking-tight mb-4 px-1 m-0 uppercase tracking-wider text-zinc-300">
            Official Music Videos & Live Performances
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.musicVideos.map(vid => (
              <div
                key={vid.id}
                onClick={() => playTrack(vid)}
                className="clay-card rounded-3xl p-3.5 cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-video mb-3 shadow-lg">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-12 h-12 rounded-full clay-btn-white text-black flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 fill-current ml-0.5 text-black" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-white truncate m-0 group-hover:text-zinc-200 transition">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5 m-0">
                    4K Ultra HD Music Video
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Artists (Fans Also Like) */}
      {profile.relatedArtists.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-white tracking-tight mb-4 px-1 m-0 uppercase tracking-wider text-zinc-300">
            Fans Also Like
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profile.relatedArtists.map((artist, idx) => (
              <div
                key={idx}
                onClick={() => onSelectArtist(artist.name)}
                className="clay-card rounded-3xl p-5 cursor-pointer group hover:scale-[1.02] transition-transform duration-300 text-center"
              >
                <img
                  src={artist.thumbnail}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover shadow-xl mb-3 border-2 border-white/10 transition-transform duration-500 group-hover:scale-105"
                />
                <h4 className="text-xs font-black text-white truncate m-0 group-hover:text-zinc-200 transition">
                  {artist.name}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5 m-0 font-medium">
                  {artist.genre}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
