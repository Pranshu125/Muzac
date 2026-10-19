import React, { useState } from 'react';
import { 
  Compass, 
  Play, 
  Flame, 
  Sparkles, 
  Music2, 
  Radio, 
  TrendingUp, 
  Loader2,
  Headphones,
  Download,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { cachedFetch } from '../utils/apiCache';
import type { Track } from '../types';

interface MoodGenre {
  name: string;
  query: string;
  subtitle: string;
}

const MOODS: MoodGenre[] = [
  { name: 'Chill & Relax', query: 'chill lofi acoustic music', subtitle: 'Acoustic & Downtempo' },
  { name: 'Workout & Energy', query: 'high energy workout gym music', subtitle: 'High BPM & Bass' },
  { name: 'Deep Focus & Study', query: 'focus ambient piano study music', subtitle: 'Ambient & Neoclassical' },
  { name: 'Hip-Hop & Rap', query: 'top hip hop rap hits 2026', subtitle: 'Global Beats & Rhymes' },
  { name: 'Rock & Alternative', query: 'rock classics modern rock anthems', subtitle: 'Guitars & Drive' },
  { name: 'Electronic & Dance', query: 'edm electronic dance music festival', subtitle: 'Synth & Festival Anthems' },
  { name: 'Global Pop Hits', query: 'billboard hot 100 global pop', subtitle: 'Chart-Topping Melodies' },
  { name: 'Late Night R&B', query: 'smooth r&b soul late night vibes', subtitle: 'Velvet Vocals & Grooves' }
];

export const ExploreView: React.FC = () => {
  const { playTrack, currentTrack, isPlaying, downloadTrack, promptAddToPlaylist } = usePlayer();
  const [selectedMood, setSelectedMood] = useState<string>('Chill & Relax');
  const [moodTracks, setMoodTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch tracks for selected mood with instant cache
  React.useEffect(() => {
    const current = MOODS.find(m => m.name === selectedMood) || MOODS[0];
    setIsLoading(true);
    cachedFetch(`/api/search?q=${encodeURIComponent(current.query)}&type=song`)
      .then(data => {
        if (data?.results) setMoodTracks(data.results);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedMood]);

  return (
    <div className="p-8 space-y-8 select-none">
      {/* Header Banner - Black & White Claymorphism */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 clay-panel-deep shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-inset text-white text-xs font-bold mb-4 tracking-wider uppercase">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
            <span>Curated Soundstages & Charts</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight m-0">
            Moods, Genres &amp; Global Charts
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed m-0">
            Explore meticulously curated soundscapes tuned for focus, workouts, late night relaxation, and chart-topping hits worldwide in Lossless bit-perfect audio.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <div className="px-5 py-3 rounded-2xl clay-inset flex items-center gap-3">
            <Headphones className="w-5 h-5 text-white animate-pulse" />
            <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-widest">
              Bit-Perfect ALAC
            </span>
          </div>
        </div>
      </div>

      {/* Moods and Genres Clay Grid */}
      <div>
        <h3 className="text-base font-bold text-white tracking-tight mb-4 px-1 uppercase tracking-wider text-zinc-400">
          Select Sonic Atmosphere
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOODS.map(mood => {
            const isSelected = selectedMood === mood.name;
            return (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                className={`p-5 rounded-3xl text-left transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? 'clay-btn-white scale-[1.02] shadow-2xl'
                    : 'clay-card hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${
                    isSelected ? 'text-zinc-600' : 'text-zinc-500'
                  }`}>
                    {mood.subtitle}
                  </span>
                  <Headphones className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-zinc-900' : 'text-zinc-400'
                  }`} />
                </div>
                <h4 className={`text-base font-black m-0 tracking-tight ${
                  isSelected ? 'text-black' : 'text-white'
                }`}>
                  {mood.name}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tracks Section for Chosen Mood */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
            <h3 className="text-xl font-black text-white tracking-tight m-0">
              {selectedMood} Rotation
            </h3>
          </div>

          {moodTracks.length > 0 && (
            <button
              onClick={() => playTrack(moodTracks[0], moodTracks)}
              className="px-5 py-2.5 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Rotation</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="h-60 flex flex-col items-center justify-center text-zinc-400 space-y-3">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-xs font-mono">Curating {selectedMood} tracks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {moodTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, moodTracks)}
                  className={`clay-card p-3.5 rounded-2xl flex items-center justify-between cursor-pointer group transition ${
                    isCurrent ? 'ring-2 ring-white/60 bg-[#161824]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0"
                    />
                    <div className="overflow-hidden flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-bold truncate m-0 transition ${
                          isCurrent ? 'text-white font-extrabold' : 'text-zinc-200 group-hover:text-white'
                        }`}>
                          {track.title}
                        </p>
                        {isCurrent && (
                          <div className={`playing-equalizer flex-shrink-0 ${isPlaying ? '' : 'paused'}`} title="Now Playing">
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate m-0 mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
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
                      title="Download Song (Bit-Perfect)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-mono text-zinc-500 w-10 text-right">
                      {track.durationFormatted || ''}
                    </span>
                    <div className="w-8 h-8 rounded-full clay-btn-white text-black flex items-center justify-center shadow-md transform group-hover:scale-105 transition">
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
