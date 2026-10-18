import React from 'react';
import { Home, Compass, Video, Radio, Library } from 'lucide-react';
import type { ViewMode } from '../types';

interface MobileBottomNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'podcasts', label: 'Podcasts', icon: Radio },
    { id: 'liked', label: 'Library', icon: Library }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 mobile-glass-dock px-2 pt-2 pb-safe flex items-center justify-around select-none border-t border-white/10"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = 
          currentView === tab.id || 
          (tab.id === 'liked' && (currentView === 'downloads' || currentView === 'playlist' || currentView === 'local'));

        return (
          <button
            key={tab.id}
            onClick={() => onSelectView(tab.id as ViewMode)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
              isActive 
                ? 'clay-btn-white scale-105' 
                : 'text-zinc-400 hover:text-white active:scale-95'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className={`text-[10px] font-black mt-0.5 tracking-tight ${isActive ? 'text-black' : 'text-zinc-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
