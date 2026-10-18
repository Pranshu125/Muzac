import React from 'react';
import { 
  Sparkles, 
  Trophy, 
  Clock, 
  Flame, 
  Music2, 
  Play, 
  Heart, 
  Disc,
  ShieldCheck,
  TrendingUp,
  Share2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const ReplayView: React.FC = () => {
  const { history, likedTracks, playTrack, navigateToArtist } = usePlayer();

  // Compute stats
  const totalMinutes = Math.max(12, Math.round(history.length * 3.4));
  
  // Artist counts
  const artistCounts: Record<string, number> = {};
  history.forEach(t => {
    artistCounts[t.artist] = (artistCounts[t.artist] || 0) + 1;
  });

  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Fallback if history is young
  if (topArtists.length === 0) {
    topArtists.push({ name: 'The Weeknd', count: 8 });
    topArtists.push({ name: 'Daft Punk', count: 5 });
    topArtists.push({ name: 'Ed Sheeran', count: 4 });
  }

  return (
    <div className="p-8 space-y-8 select-none max-w-6xl mx-auto">
      {/* Header Banner - Black & White Claymorphism */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-12 clay-panel-deep border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-inset text-white text-xs font-bold tracking-wider uppercase">
            <Trophy className="w-3.5 h-3.5 text-white" />
            <span>Apple Music Replay &bull; Spotify Wrapped</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight m-0">
            Your Listening Replay
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg leading-relaxed m-0">
            A comprehensive breakdown of your music habits, top artists, master tracks, and hours immersed in sound.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0 flex flex-col items-center p-7 rounded-3xl clay-inset">
          <span className="text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
            {totalMinutes}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-1">
            Minutes Streamed
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="clay-card rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-widest">Top Rotation</span>
            <Flame className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-2xl font-black text-white m-0 truncate">
            {topArtists[0]?.name || 'The Weeknd'}
          </h3>
          <p className="text-xs text-zinc-400 m-0">
            {topArtists[0]?.count || 12} tracks played this cycle
          </p>
        </div>

        <div className="clay-card rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-widest">Hi-Fi Vault</span>
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-2xl font-black text-white m-0">
            {likedTracks.length} Saved
          </h3>
          <p className="text-xs text-zinc-400 m-0">
            Curated in your personal Hi-Fi library
          </p>
        </div>

        <div className="clay-card rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-widest">Master Fidelity</span>
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-2xl font-black text-white m-0">
            24-Bit / 192kHz
          </h3>
          <p className="text-xs text-zinc-400 m-0">
            100% Lossless Master Stream Rate
          </p>
        </div>
      </div>

      {/* Top Artists Ranked */}
      <div className="clay-panel-deep rounded-3xl p-6 lg:p-8 border border-white/10 space-y-4">
        <h2 className="text-lg font-black text-white tracking-tight m-0 px-2 uppercase tracking-wider text-zinc-300">
          Top Artists in Your Rotation
        </h2>

        <div className="space-y-2.5">
          {topArtists.map((artist, idx) => (
            <div
              key={artist.name}
              onClick={() => navigateToArtist(artist.name)}
              className="flex items-center justify-between p-3.5 rounded-2xl clay-card cursor-pointer hover:bg-[#161824] transition group"
            >
              <div className="flex items-center gap-4">
                <span className="w-7 text-center font-black font-mono text-base text-zinc-400">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white m-0 group-hover:text-zinc-200 transition">
                    {artist.name}
                  </h4>
                  <p className="text-xs text-zinc-400 m-0">
                    Verified Artist &bull; Explore Discography &rarr;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-500 font-semibold">
                  {artist.count} Plays
                </span>
                <div className="w-8 h-8 rounded-full clay-btn-white text-black flex items-center justify-center shadow">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
