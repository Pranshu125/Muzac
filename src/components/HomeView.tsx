import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  TrendingUp, 
  Disc3, 
  Flame, 
  Heart, 
  Radio, 
  Music,
  Plus,
  Loader2,
  Download,
  Video,
  Globe2,
  CheckCircle2,
  ChevronRight,
  Search
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { cachedFetch } from '../utils/apiCache';
import type { Track, ViewMode, CategoryFilter } from '../types';

const TOP_ARTISTS = [
  { name: 'The Weeknd', genre: 'R&B / Pop', listeners: '112M', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300' },
  { name: 'Taylor Swift', genre: 'Pop / Country', listeners: '104M', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
  { name: 'Drake', genre: 'Hip-Hop / Rap', listeners: '88M', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { name: 'Billie Eilish', genre: 'Alternative / Pop', listeners: '76M', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300' },
  { name: 'Dua Lipa', genre: 'Dance Pop', listeners: '72M', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300' },
  { name: 'Kendrick Lamar', genre: 'Hip-Hop', listeners: '69M', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' }
];

const PREVIEW_CITIES = [
  { city: 'Tokyo', country: 'Japan', thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400' },
  { city: 'New York', country: 'United States', thumbnail: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
  { city: 'London', country: 'United Kingdom', thumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' },
  { city: 'Paris', country: 'France', thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' }
];

interface HomeViewProps {
  searchResults: Track[];
  isSearching: boolean;
  hasSearched?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
  selectedCategoryFilter: CategoryFilter;
  onSelectView: (view: ViewMode) => void;
  onOpenSpotifyImport: () => void;
  onSelectArtist?: (artist: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  searchResults,
  isSearching,
  hasSearched,
  searchQuery,
  onClearSearch,
  selectedCategoryFilter,
  onSelectView,
  onOpenSpotifyImport,
  onSelectArtist
}) => {
  const { 
    playTrack, 
    currentTrack, 
    isPlaying,
    toggleLike, 
    isLiked, 
    downloadTrack, 
    downloadingTrackId,
    promptAddToPlaylist 
  } = usePlayer();

  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [curatedPlaylists, setCuratedPlaylists] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      cachedFetch('/api/home'),
      cachedFetch('/api/podcasts')
    ]).then(([homeData, podcastData]) => {
      if (homeData?.featuredTracks) setFeaturedTracks(homeData.featuredTracks);
      if (homeData?.curatedPlaylists) setCuratedPlaylists(homeData.curatedPlaylists);
      if (podcastData?.podcasts) setPodcasts(podcastData.podcasts);
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const showPodcastsSection = selectedCategoryFilter === 'all' || selectedCategoryFilter === 'podcasts';
  const showMusicSection = selectedCategoryFilter === 'all' || selectedCategoryFilter === 'music' || ['chill', 'workout', 'focus'].includes(selectedCategoryFilter);
  const showVideosSection = selectedCategoryFilter === 'all' || selectedCategoryFilter === 'videos';

  if (isSearching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-zinc-400 space-y-3">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-sm font-bold">Searching across YouTube Music, Spotify &amp; Podcasts...</p>
      </div>
    );
  }

  // No Results State
  if (hasSearched && searchResults.length === 0 && !isSearching) {
    return (
      <div className="p-8 select-none max-w-2xl mx-auto my-12 text-center clay-panel-deep rounded-3xl border border-white/10 space-y-4">
        <Search className="w-12 h-12 text-zinc-500 mx-auto" />
        <h2 className="text-2xl font-black text-white m-0">
          No matches found for "{searchQuery}"
        </h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto m-0">
          Double check the spelling, or try searching for another track, artist, album, or podcast.
        </p>
        {onClearSearch && (
          <div className="pt-2">
            <button
              onClick={onClearSearch}
              className="px-5 py-2.5 rounded-2xl clay-btn-white text-black font-extrabold text-xs hover:scale-105 active:scale-95 transition"
            >
              Clear Search &amp; Return Home
            </button>
          </div>
        )}
      </div>
    );
  }

  // Search Results View
  if (searchResults.length > 0) {
    return (
      <div className="p-4 sm:p-8 space-y-6 select-none max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight m-0">
              Search Results {searchQuery ? `for "${searchQuery}"` : ''}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 m-0">
              Found {searchResults.length} verified tracks and episodes
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="px-4 py-2 rounded-2xl clay-pill text-zinc-400 hover:text-white font-bold text-xs transition"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => searchResults[0] && playTrack(searchResults[0], searchResults)}
              className="px-5 py-2.5 rounded-2xl clay-btn-white font-extrabold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play All</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {searchResults.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const liked = isLiked(track.id);
            const isDownloading = downloadingTrackId === track.id;

            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => playTrack(track, searchResults)}
                className={`clay-card p-3.5 rounded-2xl flex items-center justify-between cursor-pointer group transition ${
                  isCurrent ? 'border-white/40 bg-[#1a1b24]' : ''
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-12 h-12 rounded-xl object-cover shadow-md"
                  />
                  <div className="overflow-hidden flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate m-0 group-hover:text-zinc-200 transition">
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
                    <p 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArtist?.(track.artist);
                      }}
                      className="text-[11px] text-zinc-400 truncate m-0 hover:text-white hover:underline cursor-pointer"
                    >
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      promptAddToPlaylist(track);
                    }}
                    className="p-1.5 rounded-lg clay-pill text-zinc-400 hover:text-white transition"
                    title="Add to Playlist"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      downloadTrack(track);
                    }}
                    className="p-1.5 rounded-lg clay-pill text-zinc-400 hover:text-white transition"
                    title="Download Song"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleLike(track);
                    }}
                    className="p-1.5 rounded-lg clay-pill text-zinc-400 hover:text-white transition"
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-white text-white' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const heroTrack = featuredTracks[0];

  return (
    <div className="p-4 sm:p-8 space-y-8 sm:space-y-10 select-none max-w-7xl mx-auto">
      {/* Editorial Luxury Spotlight Carousel */}
      {heroTrack && showMusicSection && (
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-8 lg:p-10 clay-panel-deep border border-white/15 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-pill text-white text-xs font-bold mb-3 sm:mb-4 border border-white/15">
              <Flame className="w-3.5 h-3.5" />
              <span>Today's Top Spotlight &bull; ALAC Lossless Master</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight m-0">
              {heroTrack.title}
            </h1>
            <p 
              onClick={() => onSelectArtist?.(heroTrack.artist)}
              className="text-lg text-zinc-300 font-bold mt-2 m-0 hover:text-white hover:underline cursor-pointer"
            >
              {heroTrack.artist}
            </p>
            <p className="text-xs text-zinc-400 mt-1 m-0">
              Album: {heroTrack.album} &bull; 24-bit / 192 kHz Bit-Perfect Master
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => playTrack(heroTrack, featuredTracks)}
                className="px-6 py-3 rounded-2xl clay-btn-white font-extrabold text-xs flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Listen Now</span>
              </button>

              <button
                onClick={() => promptAddToPlaylist(heroTrack)}
                className="px-4 py-3 rounded-2xl clay-pill text-white text-xs font-bold flex items-center gap-2 hover:border-white/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Playlist</span>
              </button>

              <button
                onClick={() => downloadTrack(heroTrack)}
                className="px-4 py-3 rounded-2xl clay-pill text-white text-xs font-bold flex items-center gap-2 hover:border-white/30"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button
                onClick={() => toggleLike(heroTrack)}
                className="p-3 rounded-2xl clay-pill text-white hover:border-white/30"
              >
                <Heart className={`w-4 h-4 ${isLiked(heroTrack.id) ? 'fill-white text-white' : 'text-zinc-400'}`} />
              </button>
            </div>
          </div>

          <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => playTrack(heroTrack, featuredTracks)}>
            {/* Ambient Artwork Glow */}
            <div 
              className="absolute -inset-2 rounded-3xl opacity-35 blur-2xl transition-opacity group-hover:opacity-70 pointer-events-none"
              style={{ backgroundImage: `url(${heroTrack.thumbnail})`, backgroundSize: 'cover' }}
            />
            <img
              src={heroTrack.thumbnail}
              alt={heroTrack.title}
              className="relative z-10 w-56 h-56 lg:w-64 lg:h-64 rounded-3xl object-cover shadow-2xl border border-white/20 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-20 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <div className="w-14 h-14 rounded-full clay-btn-white flex items-center justify-center shadow-xl">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spotify & YouTube Music Quick Access Cards (2x3 grid) */}
      {showMusicSection && (
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-black text-white tracking-tight m-0">
              Jump Back In
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {featuredTracks.slice(0, 6).map(track => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, featuredTracks)}
                  className={`clay-card rounded-2xl p-2.5 flex items-center justify-between group cursor-pointer transition ${
                    isCurrent ? 'border-white/40 bg-[#1c1d27]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-14 h-14 rounded-xl object-cover shadow-md flex-shrink-0"
                    />
                    <div className="overflow-hidden flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-white truncate m-0 group-hover:text-zinc-200 transition">
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
                      <p 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArtist?.(track.artist);
                        }}
                        className="text-[11px] text-zinc-400 truncate mt-0.5 m-0 hover:text-white hover:underline cursor-pointer"
                      >
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pr-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        promptAddToPlaylist(track);
                      }}
                      className="p-2 rounded-xl clay-pill text-zinc-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-white transition"
                      title="Add to Playlist"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-8 h-8 rounded-full clay-btn-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Apple Music City Charts Top 100 Showcase */}
      {showMusicSection && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-white" />
              <h2 className="text-lg font-black text-white tracking-tight m-0">
                Apple Music City Top 100
              </h2>
            </div>
            <button
              onClick={() => onSelectView('city-charts')}
              className="text-xs text-white hover:underline font-bold transition flex items-center gap-1"
            >
              <span>Explore All 8 Cities</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PREVIEW_CITIES.map(c => (
              <div
                key={c.city}
                onClick={() => onSelectView('city-charts')}
                className="clay-card rounded-2xl p-3.5 cursor-pointer group hover:border-white/30 transition flex flex-col justify-between"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square mb-3">
                  <img
                    src={c.thumbnail}
                    alt={c.city}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md clay-btn-white text-[9px] font-black uppercase">
                    Top 100
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white m-0 group-hover:text-zinc-200">
                    {c.city}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 m-0">
                    {c.country} &bull; Daily Updated
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Artists */}
      {showMusicSection && (
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-black text-white tracking-tight m-0">
              Popular Artists
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TOP_ARTISTS.map(artist => (
              <div
                key={artist.name}
                onClick={() => onSelectArtist?.(artist.name)}
                className="clay-card rounded-3xl p-4 flex flex-col items-center text-center cursor-pointer group hover:border-white/30 transition"
              >
                <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden clay-pill border border-white/15">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="text-xs font-bold text-white truncate max-w-full m-0 group-hover:text-zinc-200">
                  {artist.name}
                </h4>
                <p className="text-[10px] text-zinc-400 mt-1 m-0">
                  {artist.listeners} listeners
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Podcasts Section */}
      {showPodcastsSection && podcasts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-white" />
              <h2 className="text-lg font-black text-white tracking-tight m-0">
                Top Podcasts &amp; Talk Shows
              </h2>
            </div>

            <button
              onClick={() => onSelectView('podcasts')}
              className="text-xs text-white hover:underline font-bold transition flex items-center gap-1"
            >
              <span>See All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {podcasts.slice(0, 4).map(show => (
              <div
                key={show.id}
                onClick={() => onSelectView('podcasts')}
                className="clay-card rounded-2xl p-4 cursor-pointer group hover:border-white/30 transition flex flex-col justify-between"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square mb-3">
                  <img
                    src={show.thumbnail}
                    alt={show.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md clay-pill text-[9px] font-bold text-white border border-white/20">
                    {show.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate m-0 group-hover:text-zinc-200 transition">
                    {show.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5 m-0">
                    {show.publisher}
                  </p>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed m-0">
                    {show.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spotify Top Playlists */}
      {showMusicSection && (
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-white" />
              <h2 className="text-lg font-black text-white tracking-tight m-0">
                Spotify Global Hits &amp; Daily Mixes
              </h2>
            </div>

            <button
              onClick={() => onSelectView('spotify')}
              className="text-xs text-white hover:underline font-bold transition flex items-center gap-1"
            >
              <span>Open Spotify Hub</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {curatedPlaylists.slice(0, 4).map(pl => (
              <div
                key={pl.id}
                onClick={() => onSelectView('spotify')}
                className="clay-card rounded-2xl p-3.5 cursor-pointer group hover:border-white/30 transition flex flex-col justify-between"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square mb-3">
                  <img
                    src={pl.thumbnail}
                    alt={pl.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md clay-pill text-[9px] font-black text-white border border-white/20 uppercase">
                    {pl.genre}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate m-0 group-hover:text-zinc-200 transition">
                    {pl.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 m-0">
                    {pl.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
