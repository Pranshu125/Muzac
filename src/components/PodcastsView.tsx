import React, { useState, useEffect } from 'react';
import { 
  Mic2, 
  Play, 
  Sparkles, 
  Download, 
  Clock, 
  Calendar, 
  Radio, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw, 
  RotateCw,
  Sliders,
  Check,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { PodcastShow, PodcastEpisode, Track } from '../types';

export const PodcastsView: React.FC = () => {
  const { playTrack, currentTrack, downloadTrack, downloadingTrackId, promptAddToPlaylist } = usePlayer();
  const [categories, setCategories] = useState<string[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastShow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Podcasts');
  const [selectedShow, setSelectedShow] = useState<PodcastShow | null>(null);

  useEffect(() => {
    fetch('/api/podcasts')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
        if (data.podcasts) setPodcasts(data.podcasts);
      })
      .catch(console.error);
  }, []);

  const filteredPodcasts = selectedCategory === 'All Podcasts'
    ? podcasts
    : podcasts.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handlePlayEpisode = (ep: PodcastEpisode, show: PodcastShow) => {
    const track: Track = {
      id: ep.id,
      title: ep.title,
      artist: ep.podcastName || show.title,
      album: show.title,
      duration: ep.duration,
      durationFormatted: ep.durationFormatted,
      thumbnail: ep.thumbnail || show.thumbnail,
      type: 'podcast',
      description: ep.description
    };
    playTrack(track);
  };

  return (
    <div className="p-8 space-y-8 select-none">
      {/* Header Banner - Black & White Claymorphism */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 clay-panel-deep border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-inset text-white text-xs font-bold mb-4 tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-white" />
            <span>Muzac Talk & Podcast Studio</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight m-0">
            Top Podcasts & Conversations
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed m-0">
            Immerse yourself in world-class talks on artificial intelligence, science, design, culture, and deep long-form dialogues with studio voice clarity.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <div className="px-5 py-3 rounded-2xl clay-inset flex items-center gap-3">
            <Mic2 className="w-5 h-5 text-white" />
            <span className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-widest">
              Enhanced Dialogue AI
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedShow(null);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'clay-btn-white text-black scale-105'
                : 'clay-pill text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selected Show Detailed View */}
      {selectedShow ? (
        <div className="clay-panel-deep rounded-3xl p-6 lg:p-8 border border-white/10 space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedShow(null)}
            className="text-xs text-zinc-400 hover:text-white font-bold transition flex items-center gap-1.5"
          >
            &larr; Back to all shows
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={selectedShow.thumbnail}
              alt={selectedShow.title}
              className="w-44 h-44 rounded-3xl object-cover shadow-2xl border-2 border-white/20"
            />
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 clay-inset px-3 py-1 rounded-full">
                {selectedShow.category}
              </span>
              <h2 className="text-2xl lg:text-3xl font-black text-white mt-3 m-0">
                {selectedShow.title}
              </h2>
              <p className="text-xs text-zinc-400 font-medium mt-1 m-0">
                By {selectedShow.publisher} &bull; {selectedShow.subscribers} Listeners
              </p>
              <p className="text-xs text-zinc-300 mt-2 max-w-xl leading-relaxed m-0">
                {selectedShow.description}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-2 m-0">
              Episodes ({selectedShow.episodes.length})
            </h3>

            <div className="space-y-2.5">
              {selectedShow.episodes.map(ep => {
                const isCurrent = currentTrack?.id === ep.id;
                const isDownloading = downloadingTrackId === ep.id;

                const epTrack: Track = {
                  id: ep.id,
                  title: ep.title,
                  artist: selectedShow.title,
                  duration: ep.duration,
                  thumbnail: ep.thumbnail || selectedShow.thumbnail,
                  type: 'podcast',
                  description: ep.description
                };

                return (
                  <div
                    key={ep.id}
                    className={`clay-card p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                      isCurrent ? 'ring-2 ring-white/60 bg-[#161824]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        onClick={() => handlePlayEpisode(ep, selectedShow)}
                        className="w-12 h-12 rounded-2xl clay-btn-white text-black flex items-center justify-center cursor-pointer flex-shrink-0 hover:scale-105 transition"
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5 text-black" />
                      </div>

                      <div className="overflow-hidden flex-1">
                        <h4 
                          className="text-sm font-bold text-white leading-tight m-0 hover:text-zinc-200 cursor-pointer" 
                          onClick={() => handlePlayEpisode(ep, selectedShow)}
                        >
                          {ep.title}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 m-0">
                          {ep.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500 font-mono">
                          <span>{ep.date}</span>
                          <span>&bull;</span>
                          <span>{ep.durationFormatted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => promptAddToPlaylist(epTrack)}
                        className="p-2 rounded-xl text-zinc-500 hover:text-white transition"
                        title="Add Episode to Playlist"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => downloadTrack(epTrack)}
                        disabled={isDownloading}
                        className="px-4 py-2 rounded-xl clay-pill text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 transition"
                        title="Download Episode Audio"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Shows Showcase Grid */
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-black text-white tracking-tight mb-4 px-1 uppercase tracking-wider text-zinc-400">
              Popular Talk Shows & Series
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPodcasts.map(show => (
                <div
                  key={show.id}
                  onClick={() => setSelectedShow(show)}
                  className="clay-card rounded-3xl p-4 cursor-pointer group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-3 shadow-lg">
                    <img
                      src={show.thumbnail}
                      alt={show.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full clay-inset text-[9px] font-black uppercase tracking-widest text-white">
                      {show.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white truncate m-0 group-hover:text-zinc-200 transition">
                      {show.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5 m-0 font-medium">
                      {show.publisher}
                    </p>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-2 leading-relaxed m-0">
                      {show.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Recent Episodes Row */}
          <div>
            <h3 className="text-base font-black text-white tracking-tight mb-4 px-1 uppercase tracking-wider text-zinc-400">
              Latest Conversations & Episodes
            </h3>
            <div className="space-y-2.5">
              {podcasts.flatMap(p => p.episodes.map(e => ({ episode: e, show: p }))).slice(0, 6).map(({ episode, show }) => (
                <div
                  key={episode.id}
                  onClick={() => handlePlayEpisode(episode, show)}
                  className="clay-card p-3.5 rounded-2xl flex items-center justify-between cursor-pointer group hover:bg-[#161824] transition"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden flex-1">
                    <img
                      src={episode.thumbnail || show.thumbnail}
                      alt={episode.title}
                      className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0"
                    />
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold text-white truncate m-0 group-hover:text-zinc-200 transition">
                        {episode.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5 m-0">
                        {show.title} &bull; {episode.durationFormatted}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTrack({
                          id: episode.id,
                          title: episode.title,
                          artist: show.title,
                          duration: episode.duration,
                          thumbnail: episode.thumbnail || show.thumbnail,
                          type: 'podcast'
                        });
                      }}
                      className="p-2 rounded-xl text-zinc-500 hover:text-white transition"
                      title="Direct Download Episode"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full clay-btn-white text-black flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
