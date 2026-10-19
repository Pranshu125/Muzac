import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import type { ViewMode } from '../types';

interface BreadcrumbsProps {
  currentView: ViewMode;
  selectedArtist?: string;
  selectedPlaylistTitle?: string;
  onNavigate: (view: ViewMode) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentView,
  selectedArtist,
  selectedPlaylistTitle,
  onNavigate
}) => {
  if (currentView === 'home') return null;

  const getViewLabel = (view: ViewMode): string => {
    switch (view) {
      case 'explore': return 'Explore';
      case 'podcasts': return 'Hi-Fi Podcasts';
      case 'spotify': return 'Spotify Hub';
      case 'video':
      case 'videos': return 'Music Videos';
      case 'downloads': return 'Offline Downloads';
      case 'local': return 'Local Files';
      case 'city-charts': return 'City Charts';
      case 'replay': return 'Muzac Replay';
      case 'liked': return 'Liked Songs';
      case 'playlist': return selectedPlaylistTitle || 'Playlist';
      case 'artist': return selectedArtist || 'Artist Profile';
      default: return view;
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="px-4 md:px-8 pt-4 pb-2">
      <ol className="flex items-center gap-1.5 text-xs text-neutral-400 overflow-x-auto whitespace-nowrap custom-scrollbar">
        <li>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-white transition-colors py-1 px-1.5 rounded-lg hover:bg-white/5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>

        <li>
          <ChevronRight className="w-3 h-3 text-neutral-600 flex-shrink-0" />
        </li>

        {currentView === 'artist' ? (
          <>
            <li>
              <button
                onClick={() => onNavigate('explore')}
                className="hover:text-white transition-colors py-1 px-1.5 rounded-lg hover:bg-white/5"
              >
                Artists
              </button>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 text-neutral-600 flex-shrink-0" />
            </li>
            <li className="font-semibold text-white py-1 px-1.5">
              {selectedArtist || 'Artist Profile'}
            </li>
          </>
        ) : currentView === 'playlist' ? (
          <>
            <li>
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-white transition-colors py-1 px-1.5 rounded-lg hover:bg-white/5"
              >
                Playlists
              </button>
            </li>
            <li>
              <ChevronRight className="w-3 h-3 text-neutral-600 flex-shrink-0" />
            </li>
            <li className="font-semibold text-white py-1 px-1.5 truncate max-w-[200px]">
              {selectedPlaylistTitle || 'Custom Playlist'}
            </li>
          </>
        ) : (
          <li className="font-semibold text-white py-1 px-1.5">
            {getViewLabel(currentView)}
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
