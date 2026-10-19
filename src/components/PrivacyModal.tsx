import React from 'react';
import { X, ShieldCheck, Lock, Database, Globe, EyeOff } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white backdrop-blur-xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Privacy Policy &amp; Terms</h2>
              <p className="text-xs text-neutral-400">Commitment to zero personal data harvesting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close privacy policy"
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar my-4 space-y-6 text-sm text-neutral-300 pr-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Zero Personal Data Collection</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Muzac does not collect, sell, or profile your personal identity, browsing history, device location, phone number, or personal contact information. The application is completely free and privacy-first.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-neutral-400" />
              1. Local-First Storage Architecture
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              All your custom playlists, liked tracks, listening history, custom equalizer profiles, and offline cached audio files are stored strictly on your local device via modern browser Web Storage (<code className="text-neutral-300">localStorage</code> / <code className="text-neutral-300">IndexedDB</code>). None of your listening activity is stored on remote servers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-400" />
              2. Third-Party Music Services
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-2">
              Muzac aggregates publicly accessible catalog metadata and streams from standard audio content networks:
            </p>
            <ul className="list-disc pl-5 text-xs text-neutral-400 space-y-1">
              <li><strong>YouTube Music / YouTube Embedded Player</strong>: Audio playback utilizes the official YouTube IFrame API compliant with YouTube Terms of Service.</li>
              <li><strong>Spotify Curated Feeds</strong>: Playlist information is fetched from open web catalog endpoints. No private Spotify account credentials are required or stored.</li>
              <li><strong>Apple Music City Charts</strong>: Regional chart rankings are aggregated for public display.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-neutral-400" />
              3. Client-Side Audio DSP &amp; Equalizer
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              All audio frequency filtering, 10-band graphic equalizer adjustments, spatial simulation, and pitch processing run 100% locally on your machine using the native HTML5 Web Audio API. Audio streams are never diverted or intercepted.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2">4. Service Worker &amp; Offline Caching</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Muzac uses Progressive Web App (PWA) service workers to cache essential UI assets (CSS, JS, icons) for fast 0ms loads and offline playback support. You can wipe your cache at any time using your browser settings or the built-in Clear Cache tool.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-neutral-400">
            <p>Questions regarding privacy? Contact the open audio initiative at: <span className="text-white font-medium">privacy@muzac.app</span></p>
            <p className="mt-1">Last Updated: October 2026</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-lg"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
