import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Play, 
  Sparkles, 
  Radio, 
  Download, 
  MapPin, 
  TrendingUp,
  Loader2,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { CityChart, Track } from '../types';

export const CityChartsView: React.FC = () => {
  const { playTrack, currentTrack, downloadTrack, navigateToArtist, promptAddToPlaylist } = usePlayer();
  const [cityCharts, setCityCharts] = useState<CityChart[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityChart | null>(null);
  const [cityTracks, setCityTracks] = useState<Track[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/city-charts')
      .then(res => res.json())
      .then(data => {
        if (data.charts) {
          setCityCharts(data.charts);
          setSelectedCity(data.charts[0]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCity) return;
    setIsLoadingTracks(true);
    fetch(`/api/search?q=${encodeURIComponent(selectedCity.query)}&type=song`)
      .then(res => res.json())
      .then(data => {
        if (data.results) setCityTracks(data.results);
      })
      .catch(console.error)
      .finally(() => setIsLoadingTracks(false));
  }, [selectedCity]);

  return (
    <div className="p-8 space-y-8 select-none">
      {/* City Charts Banner - Monochrome Claymorphism */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 clay-panel-deep border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-inset text-white text-xs font-bold mb-4 tracking-wider uppercase">
            <Globe2 className="w-3.5 h-3.5 text-white" />
            <span>Apple Music City Charts &bull; Daily Tally</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight m-0">
            Top 100 Cities Worldwide
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed m-0">
            Discover what listeners are streaming right now across iconic cultural epicenters from Tokyo and London to New York and Paris.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <div className="px-5 py-3 rounded-2xl clay-inset flex items-center gap-3">
            <MapPin className="w-5 h-5 text-white" />
            <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-widest">
              Live Geo-Telemetry
            </span>
          </div>
        </div>
      </div>

      {/* City Selector Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 px-1 m-0">
          Select Metropolitan Center
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {cityCharts.map(chart => {
            const isSelected = selectedCity?.city === chart.city;
            return (
              <button
                key={chart.city}
                onClick={() => setSelectedCity(chart)}
                className={`p-4 rounded-3xl text-left transition-all duration-300 relative overflow-hidden group flex items-center gap-3.5 ${
                  isSelected
                    ? 'clay-btn-white scale-[1.02] shadow-2xl'
                    : 'clay-card hover:scale-[1.01]'
                }`}
              >
                <img
                  src={chart.thumbnail}
                  alt={chart.city}
                  className="w-12 h-12 rounded-2xl object-cover shadow-md flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className={`text-xs font-black truncate m-0 ${
                    isSelected ? 'text-black' : 'text-white'
                  }`}>
                    {chart.city}
                  </h4>
                  <p className={`text-[10px] truncate mt-0.5 m-0 font-medium ${
                    isSelected ? 'text-zinc-600' : 'text-zinc-400'
                  }`}>
                    {chart.country}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected City Tracks */}
      {selectedCity && (
        <div className="clay-panel-deep rounded-3xl p-6 lg:p-8 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-white" />
              <h2 className="text-xl font-black text-white tracking-tight m-0">
                Top 25: {selectedCity.city}
              </h2>
            </div>

            {cityTracks.length > 0 && (
              <button
                onClick={() => playTrack(cityTracks[0], cityTracks)}
                className="px-5 py-2.5 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play City Chart</span>
              </button>
            )}
          </div>

          {isLoadingTracks ? (
            <div className="h-60 flex flex-col items-center justify-center text-zinc-400 space-y-3">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="text-xs font-mono">Fetching trending charts in {selectedCity.city}...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {cityTracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;

                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track, cityTracks)}
                    className={`clay-card p-3.5 rounded-2xl flex items-center justify-between cursor-pointer group transition ${
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
                      <div className="overflow-hidden">
                        <p className={`text-xs font-bold truncate m-0 transition ${
                          isCurrent ? 'text-white font-extrabold' : 'text-zinc-200 group-hover:text-white'
                        }`}>
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
                        title="Download Song Directly"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

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
      )}
    </div>
  );
};
