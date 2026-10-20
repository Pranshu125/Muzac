import React, { useState, useEffect, useRef } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';
import { LiquidBackground } from './components/LiquidBackground';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PlayerBar } from './components/PlayerBar';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { PodcastsView } from './components/PodcastsView';
import { SpotifyHub } from './components/SpotifyHub';
import { VideoPlayerView } from './components/VideoPlayerView';
import { DownloadsView } from './components/DownloadsView';
import { LocalLibrary } from './components/LocalLibrary';
import { PlaylistView } from './components/PlaylistView';
import { LyricsView } from './components/LyricsView';
import { QueueDrawer } from './components/QueueDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { EqualizerModal } from './components/EqualizerModal';
import { SpotifyImportModal } from './components/SpotifyImportModal';
import { FullscreenView } from './components/FullscreenView';
import { MasterTechModal } from './components/MasterTechModal';
import { DevicePickerModal } from './components/DevicePickerModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { ArtistView } from './components/ArtistView';
import { CityChartsView } from './components/CityChartsView';
import { ReplayView } from './components/ReplayView';
import { ContactModal } from './components/ContactModal';
import { PrivacyModal } from './components/PrivacyModal';
import { ShareModal } from './components/ShareModal';
import { BackupModal } from './components/BackupModal';
import { Breadcrumbs } from './components/Breadcrumbs';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { SpotifySourceModal } from './components/SpotifySourceModal';
import type { ViewMode, Track, CategoryFilter } from './types';

const MainLayout: React.FC = () => {
  const { 
    currentTrack,
    primaryColor, 
    secondaryColor, 
    isPlaying, 
    isVideoMode, 
    setIsVideoMode,
    selectedArtist, 
    setSelectedArtist,
    currentView, 
    setCurrentView,
    navigateToArtist
  } = usePlayer();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [isSpotifyImportOpen, setIsSpotifyImportOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [shareTargetTrack, setShareTargetTrack] = useState<Track | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState<boolean>(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);
  const [isSpotifySourceOpen, setIsSpotifySourceOpen] = useState<boolean>(false);
  const [selectedSourceTrack, setSelectedSourceTrack] = useState<Track | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Dynamic Document Title based on playback state and current view (SEO & UX)
  useEffect(() => {
    if (currentTrack) {
      document.title = `${isPlaying ? '▶' : '⏸'} ${currentTrack.title} • ${currentTrack.artist} | Muzac`;
    } else {
      const viewTitles: Record<string, string> = {
        home: 'Muzac — Liquid Glass Hi-Fi Music Player',
        explore: 'Explore & Charts — Muzac',
        podcasts: 'Top Podcasts & Shows — Muzac',
        spotify: 'Spotify Music Hub — Muzac',
        video: 'Music Videos — Muzac',
        downloads: 'Offline Downloads — Muzac',
        local: 'Local Audio Library — Muzac',
        'city-charts': 'Apple Music City Charts — Muzac',
        replay: 'Muzac Replay Recap — Annual Stats',
        artist: selectedArtist ? `${selectedArtist} — Muzac` : 'Artist Profile — Muzac',
        playlist: 'Playlist — Muzac',
        liked: 'Favorite Songs — Muzac'
      };
      document.title = viewTitles[currentView] || 'Muzac — Liquid Glass Hi-Fi Music Player';
    }
  }, [currentTrack, isPlaying, currentView, selectedArtist]);

  const searchAbortController = useRef<AbortController | null>(null);
  const debounceTimer = useRef<any>(null);

  // Spotify-style Live Debounced Search with AbortController
  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      if (searchAbortController.current) {
        searchAbortController.current.abort();
      }
      return;
    }

    if (trimmed.includes('spotify.com')) {
      setIsSpotifyImportOpen(true);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (searchAbortController.current) {
        searchAbortController.current.abort();
      }

      const controller = new AbortController();
      searchAbortController.current = controller;

      setIsSearching(true);
      setHasSearched(true);
      if (currentView !== 'home') {
        setCurrentView('home');
      }

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&type=song`, {
          signal: controller.signal
        });
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  // Handle Explicit Search Submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchQuery.includes('spotify.com')) {
      setIsSpotifyImportOpen(true);
      return;
    }

    if (searchAbortController.current) searchAbortController.current.abort();
    const controller = new AbortController();
    searchAbortController.current = controller;

    setIsSearching(true);
    setHasSearched(true);
    setIsVideoMode(false);
    setCurrentView('home');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&type=song`, {
        signal: controller.signal
      });
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectView = (view: ViewMode) => {
    if (view === 'video' || view === 'videos') {
      setIsVideoMode(true);
      setCurrentView('video');
    } else {
      setIsVideoMode(false);
      setCurrentView(view);
    }
    if (view !== 'home') {
      setSearchResults([]);
      setSearchQuery('');
      setHasSearched(false);
    }
  };

  const handleCategoryFilterSelect = (filter: CategoryFilter) => {
    setSelectedCategoryFilter(filter);
    if (filter === 'podcasts') {
      setIsVideoMode(false);
      setCurrentView('podcasts');
    } else if (filter === 'videos') {
      setIsVideoMode(true);
      setCurrentView('video');
    } else {
      setIsVideoMode(false);
      setCurrentView('home');
    }
  };

  const handleSelectPlaylist = (id: string) => {
    setSelectedPlaylistId(id);
    setCurrentView('playlist');
  };

  const handleSelectArtist = (artist: string) => {
    setSelectedArtist(artist);
    setCurrentView('artist');
  };

  return (
    <div className="relative min-h-screen text-gray-100 flex flex-col font-sans overflow-hidden bg-[#07080c]">
      {/* Ambient Mesh */}
      <LiquidBackground
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        isPlaying={isPlaying}
      />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        selectedCategoryFilter={selectedCategoryFilter}
        onSelectCategoryFilter={handleCategoryFilterSelect}
        onOpenSpotifyImport={() => setIsSpotifyImportOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Container: Sidebar + View Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={handleSelectView}
          onOpenSpotifyImport={() => setIsSpotifyImportOpen(true)}
          onSelectPlaylist={handleSelectPlaylist}
          selectedPlaylistId={selectedPlaylistId}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenBackup={() => setIsBackupOpen(true)}
          onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        />

        {/* Dynamic Center Viewport */}
        <main className="flex-1 overflow-y-auto pb-44 md:pb-28 custom-scrollbar relative z-10">
          {/* Breadcrumbs Navigation */}
          <Breadcrumbs
            currentView={currentView}
            selectedArtist={selectedArtist}
            onNavigate={handleSelectView}
          />

          {currentView === 'home' && (
            <HomeView
              searchResults={searchResults}
              isSearching={isSearching}
              hasSearched={hasSearched}
              searchQuery={searchQuery}
              onClearSearch={() => {
                setSearchQuery('');
                setSearchResults([]);
                setHasSearched(false);
              }}
              selectedCategoryFilter={selectedCategoryFilter}
              onSelectView={handleSelectView}
              onOpenSpotifyImport={() => setIsSpotifyImportOpen(true)}
              onSelectArtist={handleSelectArtist}
              onOpenShare={(t) => {
                setShareTargetTrack(t);
                setIsShareOpen(true);
              }}
              onOpenSpotifySource={(t) => {
                setSelectedSourceTrack(t);
                setIsSpotifySourceOpen(true);
              }}
            />
          )}

          {currentView === 'explore' && <ExploreView />}
          {currentView === 'podcasts' && <PodcastsView />}
          {currentView === 'spotify' && <SpotifyHub />}
          {currentView === 'video' && <VideoPlayerView onSelectView={handleSelectView} />}
          {currentView === 'downloads' && <DownloadsView />}
          {currentView === 'local' && <LocalLibrary />}
          {currentView === 'city-charts' && <CityChartsView />}
          {currentView === 'replay' && <ReplayView />}
          {currentView === 'artist' && (
            <ArtistView
              artistName={selectedArtist}
              onSelectArtist={handleSelectArtist}
            />
          )}

          {currentView === 'liked' && (
            <PlaylistView
              isLikedView
              onOpenShare={(t) => {
                setShareTargetTrack(t);
                setIsShareOpen(true);
              }}
            />
          )}
          {currentView === 'playlist' && (
            <PlaylistView
              playlistId={selectedPlaylistId}
              onOpenShare={(t) => {
                setShareTargetTrack(t);
                setIsShareOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Bottom Fixed Dock Player Bar (Desktop + Mobile Mini) */}
      <PlayerBar 
        onSelectArtist={handleSelectArtist}
        onOpenShare={(track) => {
          setShareTargetTrack(track);
          setIsShareOpen(true);
        }}
        onOpenSpotifySource={(track) => {
          setSelectedSourceTrack(track);
          setIsSpotifySourceOpen(true);
        }}
      />

      {/* Mobile Floating Bottom Navigation Dock */}
      <MobileBottomNav 
        currentView={currentView}
        onSelectView={handleSelectView}
      />

      {/* Slide-out Queue Drawer */}
      <QueueDrawer />

      {/* Fullscreen Overlay Lyrics & Apple Music Sing Mode */}
      <LyricsView />

      {/* Cinema Fullscreen View */}
      <FullscreenView />

      {/* 10-Band DSP Graphic Equalizer Modal */}
      <EqualizerModal />

      {/* Spotify Import Modal */}
      <SpotifyImportModal
        isOpen={isSpotifyImportOpen}
        onClose={() => setIsSpotifyImportOpen(false)}
      />

      {/* Apple Music Lossless Master & Spatial Audio HUD */}
      <MasterTechModal />

      {/* Spotify Connect & AirPlay Device Picker */}
      <DevicePickerModal />

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal />

      {/* Working Contact & Feedback Modal (Item 20) */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Privacy Policy Modal (Item 19) */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Social Share & WhatsApp Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        track={shareTargetTrack || currentTrack}
      />

      {/* Library Backup & JSON Restore Modal (Item: Backups) */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      {/* Authentication Modal (Sign In / Sign Up) */}
      <AuthModal />

      {/* User Profile & Account Stats Modal */}
      <UserProfileModal
        onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onPlaylistCreated={(id) => {
          setSelectedPlaylistId(id);
          setCurrentView('playlist');
        }}
      />

      {/* Spotify Multi-Source Engine & Track Intro Inspector */}
      <SpotifySourceModal
        isOpen={isSpotifySourceOpen}
        onClose={() => setIsSpotifySourceOpen(false)}
        track={selectedSourceTrack || currentTrack}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <MainLayout />
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;
